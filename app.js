import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import cors from 'cors';
import twilio from 'twilio';
import User from './models/User.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Configuración de __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de Twilio
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));


// Middleware
app.use(cors({ origin: 'http://localhost:5173', methods: 'GET,POST,PUT,PATCH,DELETE' }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas Públicas
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Jineteando');
});

// Registro de Usuario (Sign Up)
app.post('/signup', async (req, res) => {
  const { name, phone, email, password } = req.body;
  try {
    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'El número de teléfono ya está registrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      phone,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente.' });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario', details: error.message });
  }
});

// Inicio de Sesión (Login)
app.post('/login', async (req, res) => {
  const { phone, password } = req.body;
  try {
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: 'Usuario no encontrado.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Generar un token JWT si es necesario
    res.status(200).json({ message: 'Inicio de sesión exitoso.', name: user.name, token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión', details: error.message });
  }
});

// Solicitar OTP para Recuperación de Contraseña
app.post('/forgot-password', async (req, res) => {
  const { phone } = req.body;
  try {
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP válido por 10 minutos
    await user.save();

    await client.messages.create({
      body: `Tu código de recuperación es: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    res.status(200).json({ message: 'OTP enviado. Revisa tu teléfono.' });
  } catch (error) {
    console.error('Error al enviar OTP:', error);
    res.status(500).json({ error: 'Error al enviar OTP', details: error.message });
  }
});

// Validar OTP
app.post('/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;
  try {
    const user = await User.findOne({ phone, otp, otpExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: 'Código OTP inválido o expirado.' });
    }

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({ message: 'OTP validado correctamente. Puedes restablecer tu contraseña.' });
  } catch (error) {
    console.error('Error al validar OTP:', error);
    res.status(500).json({ error: 'Error al validar OTP', details: error.message });
  }
});

// Restablecer Contraseña
app.post('/reset-password', async (req, res) => {
  const { phone, newPassword } = req.body;
  try {
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Contraseña restablecida exitosamente.' });
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    res.status(500).json({ error: 'Error al restablecer contraseña', details: error.message });
  }
});

// Inicio del Servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

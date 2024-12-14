import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import twilio from 'twilio';
import User from './models/User.js';

// Cargar variables de entorno
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
    // Validar datos obligatorios
    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generar OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const user = new User({
      name,
      phone,
      email,
      password: hashedPassword,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000, // OTP válido por 10 minutos
    });

    await user.save();

    // Enviar OTP por Twilio
    await client.messages.create({
      body: `Tu código de verificación es: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    // Incluir el userId en la respuesta
    res.status(201).json({
      message: 'Usuario registrado. OTP enviado para verificación.',
      userId: user._id,
    });
  } catch (error) {
    if (error.code === 11000) {
      // Detectar campo duplicado
      const duplicateField = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `El ${duplicateField} ya está registrado.`,
      });
    }
    console.error('Error en el registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario', details: error.message });
  }
});

// Verificación de Teléfono (Verify OTP)
app.post('/verify', async (req, res) => {
  const { userId, otp } = req.body;
  try {
    const user = await User.findOne({ _id: userId, otp, otpExpires: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: 'Código OTP inválido o expirado.' });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({ message: 'Teléfono verificado exitosamente. Ya puedes iniciar sesión.' });
  } catch (error) {
    console.error('Error al verificar OTP:', error);
    res.status(500).json({ error: 'Error al verificar OTP', details: error.message });
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
    if (!user.isVerified) {
      return res.status(400).json({ message: 'Teléfono no verificado. Por favor, verifica tu número.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Inicio de sesión exitoso.', token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión', details: error.message });
  }
});

// Recuperar Contraseña (Forgot Password)
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Generar token de recuperación
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Enviar correo electrónico con el enlace
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    // Aquí puedes usar una librería como Nodemailer para enviar el correo
    console.log(`Correo enviado a ${email} con el enlace: ${resetLink}`);

    res.status(200).json({ message: 'Correo de recuperación enviado. Revisa tu bandeja de entrada.' });
  } catch (error) {
    console.error('Error al enviar correo de recuperación:', error);
    res.status(500).json({ error: 'Error al enviar correo de recuperación', details: error.message });
  }
});

// Restablecer Contraseña (Reset Password)
app.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Contraseña actualizada exitosamente.' });
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    res.status(500).json({ error: 'Error al restablecer contraseña', details: error.message });
  }
});

// Consultar Usuarios
app.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Encuentra todos los registros en la colección de usuarios
    res.status(200).json(users); // Devuelve los usuarios como JSON
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios', details: error.message });
  }
});

// Inicio del Servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
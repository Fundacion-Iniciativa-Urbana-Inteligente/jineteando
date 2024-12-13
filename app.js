import express from 'express';
import mongoose from 'mongoose';
import { join } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/mi_base_de_datos')
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));

// Middleware
app.use(express.json());
app.use(express.static(join(__dirname, "public")));

// Rutas Públicas
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Jineteando');
});

// Endpoint para usuarios (CRUD básico)
import User from './models/User.js'; // Asegúrate de tener este modelo definido

app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear usuario', details: error.message });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios', details: error.message });
  }
});

// Rutas Estáticas y Configuración de Frontend
app.get("/auth_config.json", (req, res) => {
  res.sendFile(join(__dirname, "auth_config.json"));
});

app.get("/*", (_, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

/* Solicitud de Token (Ejemplo)
const options = {
  method: 'POST',
  url: 'https://example.com/oauth/token', // Ajusta o elimina esta URL si no necesitas obtener tokens
  headers: { 'content-type': 'application/json' },
  data: {
    client_id: 'tu_client_id',
    client_secret: 'tu_client_secret',
    audience: 'http://localhost:3000/',
    grant_type: 'client_credentials',
  },
};

axios(options)
  .then((response) => {
    console.log('Token de ejemplo:', response.data);
  })
  .catch((error) => {
    console.error('Error al obtener el token:', error.message);
  }); */

// Inicio del Servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

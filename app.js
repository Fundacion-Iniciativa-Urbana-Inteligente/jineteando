import express from 'express';
import mongoose from 'mongoose';
/*/ import User from './models/User.js';/*/
import { join } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';
import { auth, requiredScopes } from 'express-oauth2-jwt-bearer';
/*import pkg from 'mongodb';*/
import axios from 'axios';

const app = express();
const port = process.env.PORT || 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: 'http://localhost:3000/',
  issuerBaseURL: `https://dev-fxlyp2lwts1h3fbx.us.auth0.com/`,
});

app.use(express.json());

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/mi_base_de_datos', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Conectado a MongoDB');
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB', err);
  });

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Aquí puedes añadir más rutas y middleware
app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Serve static assets from the /public folder
app.use(express.static(join(__dirname, "public")));

// Endpoint to serve the configuration file
app.get("/auth_config.json", (req, res) => {
  res.sendFile(join(__dirname, "auth_config.json"));
});

// Serve the index page for all other requests
app.get("/*", (_, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

// This route doesn't need authentication
app.get('/api/public', function(req, res) {
  res.json({
    message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
  });
});

// This route needs authentication
app.get('/api/private', checkJwt, function(req, res) {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated to see this.'
  });
});

const checkScopes = requiredScopes('read:messages');

app.get('/api/private-scoped', checkJwt, checkScopes, function(req, res) {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'
  });
});

const options = {
  method: 'POST',
  url: 'https://dev-fxlyp2lwts1h3fbx.us.auth0.com/oauth/token',
  headers: { 'content-type': 'application/json' },
  data: {
    client_id: 'L0I3wRyJAVXZYaN3TZPXHf4fTK7pbLPl',
    client_secret: 'juOZuUh8PPLcXNMXGcWJzhp2TCcdlL__bl7H165GZgF4ILVaUoDuQi1vKbZ3e6kf',
    audience: 'http://localhost:3000/',
    grant_type: 'client_credentials'
  }
};

axios(options)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });
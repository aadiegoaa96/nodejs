//diegoPR

const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');

// Conectar a la base de datos de MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});

// Definir el esquema del documento en MongoDB
const userSchema = new mongoose.Schema(
  {
    id: Number,
    name: String,
    username: String,
    email: String,
    createdAt: Date,
    updatedAt: Date,
  },
  { timestamps: true }
);

// Definir el modelo para la colección 'users'
const User = mongoose.model('User', userSchema);

// Crear una instancia de Express
const app = express();

// Ruta GET /users/:id
app.get('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const url = `https://jsonplaceholder.typicode.com/users/${userId}`;

  try {
    const response = await axios.get(url);

    const userData = response.data;
    userData.createdAt = new Date();
    userData.updatedAt = new Date();

    // Buscar si el usuario ya existe en la base de datos
    const filter = { id: userData.id };
    const update = { $set: userData };
    const options = { upsert: true };

    await User.updateOne(filter, update, options);

    console.log('Datos del usuario guardados en MongoDB.');

    res.json(userData);
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error.message);
    res.status(500).json({ error: 'Error al obtener los datos del usuario' });
  }
});

// Puerto en el que se ejecutará el servidor
const port = 3000;

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor Express iniciado en el puerto ${port}`);
});

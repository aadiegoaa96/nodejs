const axios = require('axios');
const mongoose = require('mongoose');

// Conectarse a la base de datos de MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Tiempo máximo de espera para seleccionar el servidor
  socketTimeoutMS: 45000, // Tiempo máximo de espera para las operaciones de socket
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

async function getUsersFromAPI(userId) {
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

  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error.message);
  }
}

// Ejecutar la función para obtener y guardar los datos del usuario
getUsersFromAPI(3);

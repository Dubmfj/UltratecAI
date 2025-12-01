// models/User.js

const mongoose = require('mongoose');

// 1. Define el Esquema (Schema)
// Esto es el plano de cómo se verán los documentos de usuario en la DB.
const UserSchema = new mongoose.Schema({
  // El nombre de usuario que usarán para iniciar sesión
    username: {
    type: String,
    required: true,      // Este campo es obligatorio
    unique: true         // Asegura que no haya dos usuarios con el mismo nombre
    },

  // La contraseña (OJO: guardaremos la versión ENCRIPTADA/HASHEADA, no la original)
    password: { 
    type: String,
    required: true
    }
});

// 2. Exporta el Modelo
// "User" es el nombre que Mongoose usará para la colección en MongoDB.
module.exports = mongoose.model('User', UserSchema);
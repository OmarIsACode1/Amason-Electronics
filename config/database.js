// Biblioteca importada
const mongoose = require('mongoose');

// Función asíncrona para establecer la conexión
const conectarDB = async () => {
    try { // Detecta errores durante la conexión
        await mongoose.connect(process.env.MONGODB_URI); // Usamos la dirección almacenada en .env

        console.log('MongoDB Atlas conectado correctamente');
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error.message);
        process.exit(1); // Detiene el servidor si no consigue conectarse a la base de datos.
    }
};

module.exports = conectarDB; // Permite usar la función desde server.js
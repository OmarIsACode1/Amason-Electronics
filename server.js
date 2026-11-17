// Importamos la librerías
require('dotenv').config();

const conectarDB = require('./config/database');
const express = require('express');
authRoutes = require('./routes/authRoutes');

// Creamos la aplicación de Express
const app = express();

// Permitir que Express interprete solicitudes JSON
app.use(express.json());

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Definimos el puerto del servidor
const PORT = 3000;

// Ruta principal
app.get('/', (req, res) => {
    res.send('Bienvenido a Amason Electronics');
});

// Iniciar el servidor
const iniciarServidor = async () => {
    await conectarDB();

    app.listen(PORT, () => {
        console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
};
iniciarServidor();
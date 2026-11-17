// // Importamos la librerías
// require('dotenv').config();

// const conectarDB = require('./config/database');
// const express = require('express');
// const authRoutes = require('./routes/authRoutes');
// const productRoutes = require('./routes/productRoutes');

// // Creamos la aplicación de Express
// const app = express();

// // Servir archivos estáticos desde la carpeta public
// app.use(express.static('public'));

// // Permitir que Express interprete solicitudes JSON
// app.use(express.json());

// // Ruta de autenticación
// app.use('/api/auth', authRoutes);

// // Ruta de productos
// app.use('/api/products', productRoutes);

// // Definimos el puerto del servidor
// const PORT = 3000;

// // Ruta principal
// app.get('/', (req, res) => {
//     res.send('Bienvenido a Amason Electronics');
// });

// // Iniciar el servidor
// const iniciarServidor = async () => {
//     await conectarDB();

//     app.listen(PORT, () => {
//         console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
//     });
// };
// iniciarServidor();

// SE COMENTA CON CTRL+C, LUEGO CTRL+K
// SE DESCOMENTA CON CTRL+C, LUEGO CTRL+U
// SELECCIONAS TODO EN AMBOS CASOS

require('dotenv').config();

const conectarDB = require('./config/database');
const app = require('./appExpress');

const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
    await conectarDB();

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
};
iniciarServidor();
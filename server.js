// Importamos la librería Express
const express = require('express');

// Creamos la aplicación de Express
const app = express();

// Permitir que Express interprete solicitudes JSON
app.use(express.json());

// Definimos el puerto del servidor
const PORT = 3000;

// Ruta principal
app.get('/', (req, res) => {
    res.send('Bienvenido a Amason Electronics');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
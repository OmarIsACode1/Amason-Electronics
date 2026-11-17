const express = require('express');
const router = express.Router();

const verificarToken = require('../middleware/authMiddleware');

const { crearProducto, obtenerProductos } = require('../controllers/productController');

// Todas las rutas de este archivo requieren autenticación
router.use(verificarToken);

// Registrar producto
router.post('/', crearProducto);

// Consultar producto
router.get('/', obtenerProductos);

module.exports = router;
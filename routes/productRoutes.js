const express = require('express');
const router = express.Router();

const verificarToken = require('../middleware/authMiddleware');

const { crearProducto, obtenerProductos, actualizarProducto, eliminarProducto } = require('../controllers/productController');

// Todas las rutas de este archivo requieren autenticación
router.use(verificarToken);

// Registrar producto
router.post('/', crearProducto);

// Consultar producto
router.get('/', obtenerProductos);

// Actualizar producto
router.put('/:id', actualizarProducto);

// Eliminar producto
router.delete('/:id', eliminarProducto);

module.exports = router;
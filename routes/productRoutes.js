const express = require('express');
const router = express.Router();

const verificarToken = require('../middleware/authMiddleware');

const { crearProducto } = require('../controllers/productController');

// Todas las rutas de este archivo requieren autenticación
router.use(verificarToken);

// Registrar producto
router.post('/', crearProducto);

module.exports = router;
const Product = require('../models/Product');

// REGISTRAR PRODUCTO
const crearProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, existencias } = req.body;

        // Comprobar que todos los campos estén presentes
        if (!nombre || !descripcion || precio === undefined || existencias === undefined) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        // Creamos el producto en MongoDB
        const nuevoProducto = await Product.create({
            nombre, descripcion, precio, existencias, usuario: req.usuario.id
        });

        res.status(201).json({
            mensaje: 'Producto registrado correctamente',
            producto: nuevoProducto
        });
    } catch (error) {
        console.error('Error al registrar producto:', error.message);
        
        res.status(500).json({
            mensaje: 'Error interno al registrar el producto'
        });
    }
};
module.exports={
    crearProducto
};
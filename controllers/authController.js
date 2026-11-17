const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTRO DE USUARIOS
const registrarUsuario = async (req, res) => {
    try {
        const { nombre, correo, password } = req.body;

        // Validar los datos recibidos
        if (!nombre || !correo || !password) {
            return res.status(400).json({
                mensaje: 'Todos los campos son obligatorios'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                mensaje: 'La contraseña debe tener al menos 8 caracteres'
            });
        }

        const correoNormalizado = correo.trim().toLowerCase();

        // Comprobar si el correo ya está registrado, se busca el usuario
        const usuarioExistente = await User.findOne({
            correo: correoNormalizado
        });

        if (usuarioExistente) {
            return res.status(409).json({
                mensaje: 'El correo ya está registrado'
            });
        }

        // Generar el hash de la contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // Crear el usuario en MongoDB
        const nuevoUsuario = await User.create({
            nombre: nombre.trim(),
            correo: correoNormalizado,
            password: passwordHash
        });

        res.status(201).json({
            mensaje: 'Usuario registrado correctamente',
            usuario: {
                id: nuevoUsuario._id,
                nombre: nuevoUsuario.nombre,
                correo: nuevoUsuario.correo
            }
        });

    } catch (error) {
        console.error('Error en el registro:', error.message);

        res.status(500).json({
            mensaje: 'Error interno al registrar el usuario'
        });
    }
};

// INICIO DE SESIÓN
const iniciarSesion = async (req, res) => {
    try {
        const { correo, password } = req.body;

        if (!correo || !password) {
            return res.status(400).json({
                mensaje: 'Correo y contraseña son obligatorios'
            });
        }

        // Buscar al usuario por su correo
        const usuario = await User.findOne({
            correo: correo.trim().toLowerCase()
        });

        if (!usuario) {
            return res.status(401).json({
                mensaje: 'Credenciales incorrectas'
            });
        }

        // Comparar la contraseña con el hash almacenado
        const passwordCorrecta = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!passwordCorrecta) {
            return res.status(401).json({
                mensaje: 'Credenciales incorrectas'
            });
        }

        // Generar el token JWT
        const token = jwt.sign(
            { id: usuario._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );

        res.status(200).json({
            mensaje: 'Inicio de sesión exitoso',
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                correo: usuario.correo
            }
        });

    } catch (error) {
        console.error('Error en el inicio de sesión:', error.message);

        res.status(500).json({
            mensaje: 'Error interno al iniciar sesión'
        });
    }
};

module.exports = {
    registrarUsuario,
    iniciarSesion
};
const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    // 1. Obtener el token de la cabecera Authorization
    const authHeader = req.headers.authorization;

    // 2. Comprobar que exista la cabecera
    if (!authHeader) {
        return res.status(401).json({
            mensaje: 'Acceso denegado. No se proporcionó un token.'
        });
    }

    // 3. Extraer el token
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            mensaje: 'Formato de token inválido.'
        });
    }

    try {
        // 4. Verificar el token
        const verificado = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // 5. Guardar los datos del usuario en la petición
        req.usuario = verificado;

        // 6. Permitir que continúe la petición
        next();

    } catch (error) {
        return res.status(401).json({
            mensaje: 'Token inválido o expirado.'
        });
    }
};

module.exports = verificarToken;
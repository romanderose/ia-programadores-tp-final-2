const jwt = require('jsonwebtoken');

/**
 * Middleware de Autenticación
 * 
 * Verifica si la petición tiene un token JWT válido en los headers.
 * Si es válido, decodifica el token y añade el ID del usuario a la request.
 * Si no es válido o no existe, devuelve un error.
 * 
 * @param {Object} req - Objeto de solicitud (Request)
 * @param {Object} res - Objeto de respuesta (Response)
 * @param {Function} next - Función para pasar al siguiente middleware/controlador
 */

module.exports = (req, res, next) => {
    // 1. Get token from header
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ success: false, message: 'No token provided.' });
    }

    // 2. Remove 'Bearer ' prefix if present
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;

    // 3. Verify token
    jwt.verify(cleanToken, process.env.JWT_SECRET || 'secret_key', (err, decoded) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to authenticate token.' });
        }
        // 4. Save user id for use in other routes
        req.userId = decoded.id;
        next();
    });
};

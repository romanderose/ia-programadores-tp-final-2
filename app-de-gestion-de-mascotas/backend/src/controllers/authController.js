const bcrypt = require('bcrypt');
const db = require('../db'); // Conexión a MySQL configurada con promesas
const jwt = require('jsonwebtoken');

/**
 * Registra un nuevo usuario en la base de datos.
 */
const registrarUsuario = async (req, res) => {
    // Recibimos 'username' y 'password' desde el cuerpo de la petición (JSON)
    const { username, password } = req.body;

    try {
        // 1. Encriptamos la contraseña con un costo de hash de 10.
        // Nunca guardes contraseñas en texto plano por seguridad.
        const hashedPassword = await bcrypt.hash(password, 10);

        // 2. Insertamos el usuario en la tabla 'usuarios'.
        // Usamos '?' para prevenir ataques de Inyección SQL.
        await db.query(
            'INSERT INTO usuarios (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );

        // Si todo sale bien, respondemos con éxito (201: Creado)
        res.status(201).json({ success: true, message: "Usuario registrado con éxito" });
    } catch (error) {
        console.error(error);
        // Si el 'username' es UNIQUE en la DB, saltará error si intentan repetir el nombre
        res.status(500).json({ success: false, error: "Error al registrar, el usuario ya existe" });
    }
};

/**
 * Valida las credenciales e inicia sesión.
 */
const loginUsuario = async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Buscamos al usuario por su nombre
        const [rows] = await db.query('SELECT * FROM usuarios WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: "Usuario o contraseña incorrectos" });
        }

        const usuario = rows[0];

        // 2. Comparamos la contraseña ingresada con el hash guardado en la DB
        const match = await bcrypt.compare(password, usuario.password);

        if (match) {
            // Generar Token JWT
            const token = jwt.sign(
                { id: usuario.id, username: usuario.username },
                process.env.JWT_SECRET || 'secret_key',
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                token,
                user: { id: usuario.id, username: usuario.username }
            });
        } else {
            res.status(401).json({ success: false, message: "Usuario o contraseña incorrectos" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
    }
};

/**
 * Verifica si un nombre de usuario ya está ocupado.
 * Esta función la usa tu servicio 'checkUsernameExists' en el frontend.
 */
const verificarUsuario = async (req, res) => {
    // Obtenemos el username de los parámetros de la URL (?username=...)
    const { username } = req.query;

    try {
        const [rows] = await db.query('SELECT id FROM usuarios WHERE username = ?', [username]);

        // Si hay resultados, significa que el usuario ya existe (exists: true)
        res.json({ exists: rows.length > 0 });
    } catch (error) {
        console.error('Error en registro de usuario:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};

/**
 * Cierra la sesión (Lógica básica).
 */
const logoutUsuario = async (req, res) => {
    // Si usas JWT, el cliente simplemente borra el token. 
    // Si usas cookies/sesiones, aquí se destruirían.
    res.json({ success: true, message: "Sesión cerrada" });
};

// Exportamos todas las funciones para que 'authRoutes.js' las pueda usar
module.exports = {
    registrarUsuario,
    loginUsuario,
    verificarUsuario,
    logoutUsuario
};
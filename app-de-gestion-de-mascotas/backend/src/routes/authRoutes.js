const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// RUTA: Registro de usuarios
// Se activa cuando el frontend hace un fetch POST a /api/auth/register
// Recibe: { username, password }
router.post('/register', authController.registrarUsuario);

// RUTA: Inicio de sesión
// Se activa cuando el frontend hace un fetch POST a /api/auth/login
// Valida las credenciales contra la base de datos MySQL
router.post('/login', authController.loginUsuario);

// RUTA: Verificación de disponibilidad
// Esta es fundamental para tu componente Registro.tsx
// Se activa cuando el frontend hace un fetch GET a /api/auth/check-username?username=...
// Permite saber si el nombre ya existe antes de intentar el registro
router.get('/check-username', authController.verificarUsuario);

// RUTA: Cerrar sesión
// Limpia la sesión o el token del usuario en el servidor
router.post('/logout', authController.logoutUsuario);

// Exportamos el router para que app.js (el servidor principal) pueda usarlo
module.exports = router;
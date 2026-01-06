/**
 * apiRoutes.js
 * 
 * Define las rutas principales de la API para la gestión de datos.
 * Todas estas rutas están protegidas por el middleware de autenticación.
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const mascotasController = require('../controllers/mascotasController');
const turnosController = require('../controllers/turnosController');
const historialController = require('../controllers/historialController');
const registrosController = require('../controllers/registrosController');
const historialesController = require('../controllers/historialesController');
const eventosController = require('../controllers/eventosController');

// Rutas protegidas
router.use(authMiddleware);

// Mascotas
router.get('/mascotas', mascotasController.getAll);
router.post('/mascotas', mascotasController.create);
router.delete('/mascotas/:id', mascotasController.delete);
router.put('/mascotas/:id', mascotasController.update);

// Turnos
router.get('/turnos', turnosController.getAll);
router.post('/turnos', turnosController.create);

// Historial
router.get('/historial', historialController.getAll);
router.post('/historial', historialController.create);

// Registros Clínicos (user-created records) - DEPRECATED, usar historiales
router.get('/registros', registrosController.getAll);
router.post('/registros', registrosController.create);
router.get('/registros/check/:mascotaId', registrosController.checkPetHasRecords);

// Historiales Clínicos (new structure)
router.get('/historiales', historialesController.getAll);
router.get('/historiales/check/:mascotaId', historialesController.checkPetHasHistory);
router.post('/historiales', historialesController.create);

// Eventos Clínicos
router.post('/eventos', eventosController.create);
router.put('/eventos/:id', eventosController.update);
router.delete('/eventos/:id', eventosController.delete);

module.exports = router;


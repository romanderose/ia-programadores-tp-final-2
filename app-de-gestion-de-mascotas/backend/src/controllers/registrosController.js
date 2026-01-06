/**
 * registrosController.js
 * 
 * Controlador para gestionar registros clínicos individuales.
 * DEPRECADO: Este controlador se usa para la versión antigua de registros.
 * Se recomienda usar historialesController para la nueva lógica.
 */

const db = require('../db');

exports.getAll = async (req, res) => {
    try {
        const sql = 'SELECT * FROM registros_clinicos WHERE usuario_id = ?';
        const [rows] = await db.query(sql, [req.userId]);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener registros:', error);
        res.status(500).json({ error: 'Error al obtener registros' });
    }
};

exports.create = async (req, res) => {
    const { mascota_id, nota_inicial, fecha, tipo, detalle, estado } = req.body;
    try {
        await db.query(
            'INSERT INTO registros_clinicos (mascota_id, usuario_id, nota_inicial, fecha, tipo, detalle, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [mascota_id, req.userId, nota_inicial, fecha, tipo, detalle, estado]
        );
        res.status(201).json({ success: true, message: 'Registro clínico creado' });
    } catch (error) {
        console.error('Error al crear registro:', error);
        res.status(500).json({ error: 'Error al guardar registro' });
    }
};

exports.checkPetHasRecords = async (req, res) => {
    try {
        const { mascotaId } = req.params;
        const [rows] = await db.query('SELECT id FROM registros_clinicos WHERE mascota_id = ?', [mascotaId]);
        res.json({ hasRecords: rows.length > 0 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al verificar registros' });
    }
};

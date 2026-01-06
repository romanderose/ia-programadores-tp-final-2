const db = require('../db');

exports.getAll = async (req, res) => {
    try {
        // Obtenemos los turnos con el nombre de la mascota
        const sql = `
            SELECT t.*, m.nombre as nombre_mascota 
            FROM turnos t 
            JOIN mascotas m ON t.mascota_id = m.id 
            WHERE t.usuario_id = ?
            ORDER BY t.fecha ASC, t.hora ASC
        `;
        const [rows] = await db.query(sql, [req.userId]);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener turnos:', error);
        res.status(500).json({ error: 'Error al obtener turnos' });
    }
};

exports.create = async (req, res) => {
    const { mascota_id, veterinario, fecha, hora, sucursal } = req.body;
    try {
        await db.query(
            'INSERT INTO turnos (usuario_id, mascota_id, veterinario, fecha, hora, sucursal) VALUES (?, ?, ?, ?, ?, ?)',
            [req.userId, mascota_id, veterinario, fecha, hora, sucursal]
        );
        res.status(201).json({ success: true, message: 'Turno agendado' });
    } catch (error) {
        console.error('Error al crear turno:', error);
        res.status(500).json({ error: 'Error al solicitar turno' });
    }
};

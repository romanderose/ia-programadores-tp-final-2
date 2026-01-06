/**
 * historialController.js
 * 
 * Controlador para el historial médico simple.
 * (Nota: Este controlador parece ser una versión simplificada o alternativa a historialesController).
 */

const db = require('../db');

exports.getAll = async (req, res) => {
    try {
        // Obtenemos historial uniendo con mascotas para ver el nombre y filtrar por usuario si fuera necesario
        // Aquí asumimos que queremos TODO el historial de las mascotas del usuario
        const sql = `
            SELECT h.*, m.nombre as nombre_mascota
            FROM historial_clinico h
            JOIN mascotas m ON h.mascota_id = m.id
            WHERE m.usuario_id = ?
            ORDER BY h.fecha DESC
        `;
        const [rows] = await db.query(sql, [req.userId]);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener historial:', error);
        res.status(500).json({ error: 'Error al obtener historial' });
    }
};

exports.create = async (req, res) => {
    const { mascota_id, veterinario, fecha, tipo, diagnostico, sucursal } = req.body;
    try {
        // Validar que la mascota pertenezca al usuario (opcional pero recomendado)
        const [petRows] = await db.query('SELECT id FROM mascotas WHERE id = ? AND usuario_id = ?', [mascota_id, req.userId]);
        if (petRows.length === 0) {
            return res.status(403).json({ error: 'Mascota no encontrada o no autorizada' });
        }

        await db.query(
            'INSERT INTO historial_clinico (mascota_id, veterinario, fecha, tipo, diagnostico, sucursal) VALUES (?, ?, ?, ?, ?, ?)',
            [mascota_id, veterinario, fecha, tipo, diagnostico, sucursal]
        );
        res.status(201).json({ success: true, message: 'Registro clínico agregado' });
    } catch (error) {
        console.error('Error al crear entrada de historial:', error);
        res.status(500).json({ error: 'Error al guardar en el historial' });
    }
};

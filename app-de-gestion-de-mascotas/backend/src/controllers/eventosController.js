/**
 * eventosController.js
 * 
 * Controlador para los Eventos Clínicos.
 * Los eventos son entradas individuales dentro de un Historial Clínico.
 * Maneja creación, edición y eliminación de eventos.
 */

const db = require('../db');

exports.create = async (req, res) => {
    const { historial_id, fecha, tipo, detalle, estado } = req.body;

    try {
        // Verify history exists and belongs to user
        const [historyRows] = await db.query(
            'SELECT id FROM historiales_clinicos WHERE id = ? AND usuario_id = ?',
            [historial_id, req.userId]
        );

        if (historyRows.length === 0) {
            return res.status(403).json({ error: 'Historial no encontrado o no autorizado' });
        }

        // Insert new event
        const [result] = await db.query(
            `INSERT INTO eventos_clinicos (historial_id, fecha, tipo, detalle, estado) 
             VALUES (?, ?, ?, ?, ?)`,
            [historial_id, fecha, tipo, detalle, estado]
        );

        res.status(201).json({
            success: true,
            message: 'Evento clínico agregado exitosamente',
            id: result.insertId
        });
    } catch (error) {
        console.error('Error al crear evento:', error);
        res.status(500).json({ error: 'Error al agregar evento' });
    }
};

exports.update = async (req, res) => {
    const { id } = req.params;
    const { fecha, tipo, detalle, estado } = req.body;

    try {
        // Verify event exists and belongs to user through history
        const [eventRows] = await db.query(
            `SELECT e.id FROM eventos_clinicos e
             JOIN historiales_clinicos h ON e.historial_id = h.id
             WHERE e.id = ? AND h.usuario_id = ?`,
            [id, req.userId]
        );

        if (eventRows.length === 0) {
            return res.status(403).json({ error: 'Evento no encontrado o no autorizado' });
        }

        await db.query(
            'UPDATE eventos_clinicos SET fecha = ?, tipo = ?, detalle = ?, estado = ? WHERE id = ?',
            [fecha, tipo, detalle, estado, id]
        );

        res.json({ success: true, message: 'Evento actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar evento:', error);
        res.status(500).json({ error: 'Error al actualizar evento' });
    }
};

exports.delete = async (req, res) => {
    const { id } = req.params;

    try {
        // Verify event exists and belongs to user through history
        const [eventRows] = await db.query(
            `SELECT e.id FROM eventos_clinicos e
             JOIN historiales_clinicos h ON e.historial_id = h.id
             WHERE e.id = ? AND h.usuario_id = ?`,
            [id, req.userId]
        );

        if (eventRows.length === 0) {
            return res.status(403).json({ error: 'Evento no encontrado o no autorizado' });
        }

        await db.query('DELETE FROM eventos_clinicos WHERE id = ?', [id]);

        res.json({ success: true, message: 'Evento eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar evento:', error);
        res.status(500).json({ error: 'Error al eliminar evento' });
    }
};

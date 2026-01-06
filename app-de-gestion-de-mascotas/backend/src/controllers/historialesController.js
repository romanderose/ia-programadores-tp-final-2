/**
 * historialesController.js
 * 
 * Controlador principal para los Historiales Clínicos (Estructura nueva).
 * Maneja la creación de historiales y la consulta de eventos relacionados.
 * Utiliza transacciones para asegurar la integridad de datos al crear historial + primer evento.
 */

const db = require('../db');

/**
 * Obtiene todos los historiales clínicos y sus eventos asociados.
 */
exports.getAll = async (req, res) => {
    try {
        // Get all clinical histories for user's pets with events
        const sql = `
            SELECT 
                h.id,
                h.mascota_id,
                h.nota_inicial,
                h.fecha_creacion,
                m.nombre as nombre_mascota,
                m.foto as foto_mascota
            FROM historiales_clinicos h
            JOIN mascotas m ON h.mascota_id = m.id
            WHERE h.usuario_id = ?
            ORDER BY h.fecha_creacion DESC
        `;
        const [historiales] = await db.query(sql, [req.userId]);

        // Get events for each history
        for (let historial of historiales) {
            const [eventos] = await db.query(
                `SELECT id, fecha, tipo, detalle, estado, fecha_creacion
                 FROM eventos_clinicos
                 WHERE historial_id = ?
                 ORDER BY fecha DESC, fecha_creacion DESC`,
                [historial.id]
            );
            historial.eventos = eventos;
        }

        res.json(historiales);
    } catch (error) {
        console.error('Error al obtener historiales:', error);
        res.status(500).json({ error: 'Error al obtener historiales' });
    }
};

/**
 * Verifica si una mascota ya posee un historial clínico.
 */
exports.checkPetHasHistory = async (req, res) => {
    try {
        const { mascotaId } = req.params;

        // Verify pet belongs to user
        const [petRows] = await db.query(
            'SELECT id FROM mascotas WHERE id = ? AND usuario_id = ?',
            [mascotaId, req.userId]
        );

        if (petRows.length === 0) {
            return res.status(403).json({ error: 'Mascota no encontrada o no autorizada' });
        }

        // Check if pet has a clinical history
        const [historyRows] = await db.query(
            'SELECT id FROM historiales_clinicos WHERE mascota_id = ?',
            [mascotaId]
        );

        res.json({ hasHistory: historyRows.length > 0 });
    } catch (error) {
        console.error('Error al verificar historial:', error);
        res.status(500).json({ error: 'Error al verificar historial' });
    }
};

/**
 * Crea un nuevo historial clínico junto con su primer evento (Transaccional).
 */
exports.create = async (req, res) => {
    const { mascota_id, nota_inicial, primer_evento } = req.body;

    try {
        // Validate pet belongs to user
        const [petRows] = await db.query(
            'SELECT id FROM mascotas WHERE id = ? AND usuario_id = ?',
            [mascota_id, req.userId]
        );

        if (petRows.length === 0) {
            return res.status(403).json({ error: 'Mascota no encontrada o no autorizada' });
        }

        // Check if pet already has a clinical history
        const [existingHistory] = await db.query(
            'SELECT id FROM historiales_clinicos WHERE mascota_id = ?',
            [mascota_id]
        );

        if (existingHistory.length > 0) {
            return res.status(400).json({ error: 'Esta mascota ya tiene un historial clínico' });
        }

        // Start transaction
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // Create clinical history
            const [historyResult] = await connection.query(
                `INSERT INTO historiales_clinicos (mascota_id, usuario_id, nota_inicial) 
                 VALUES (?, ?, ?)`,
                [mascota_id, req.userId, nota_inicial]
            );

            const historialId = historyResult.insertId;

            // Create first event
            await connection.query(
                `INSERT INTO eventos_clinicos (historial_id, fecha, tipo, detalle, estado) 
                 VALUES (?, ?, ?, ?, ?)`,
                [historialId, primer_evento.fecha, primer_evento.tipo, primer_evento.detalle, primer_evento.estado]
            );

            await connection.commit();
            connection.release();

            res.status(201).json({
                success: true,
                message: 'Historial clínico creado exitosamente',
                id: historialId
            });
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    } catch (error) {
        console.error('Error al crear historial:', error);
        res.status(500).json({ error: 'Error al crear historial clínico' });
    }
};

/**
 * mascotasController.js
 * 
 * Controlador para la gestión de mascotas.
 * Permite obtener, crear, actualizar y eliminar mascotas asociadas a un usuario.
 */

const db = require('../db');

exports.getAll = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM mascotas WHERE usuario_id = ?', [req.userId]);
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener mascotas:', error);
        res.status(500).json({ error: 'Error al obtener mascotas' });
    }
};

exports.create = async (req, res) => {
    const { nombre, tipo, raza, edad, peso, foto } = req.body;
    try {
        await db.query(
            'INSERT INTO mascotas (usuario_id, nombre, tipo, raza, edad, peso, foto) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.userId, nombre, tipo, raza, edad, peso, foto]
        );
        res.status(201).json({ success: true, message: 'Mascota agregada' });
    } catch (error) {
        console.error('Error al agregar mascota:', error);
        res.status(500).json({ error: 'Error al agregar mascota' });
    }
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM mascotas WHERE id = ? AND usuario_id = ?', [id, req.userId]);
        res.json({ success: true, message: 'Mascota eliminada' });
    } catch (error) {
        console.error('Error al eliminar mascota:', error);
        res.status(500).json({ error: 'Error al eliminar mascota' });
    }
};

exports.update = async (req, res) => {
    const { id } = req.params;
    const { nombre, tipo, raza, edad, peso, foto } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE mascotas SET nombre = ?, tipo = ?, raza = ?, edad = ?, peso = ?, foto = ? WHERE id = ? AND usuario_id = ?',
            [nombre, tipo, raza, edad, peso, foto, id, req.userId]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Mascota no encontrada o no autorizada' });
        }
        res.json({ success: true, message: 'Mascota actualizada' });
    } catch (error) {
        console.error('Error al actualizar mascota:', error);
        res.status(500).json({ error: 'Error al actualizar mascota' });
    }
};

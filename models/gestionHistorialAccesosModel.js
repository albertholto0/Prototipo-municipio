const db = require('../config/database');

class HistorialAccesos {
    static async getAll() {
        try {
            const [rows] = await db.query(
                'SELECT * FROM historial_accesos'
            );
            return rows;
        } catch (err) {
            console.error('Error al obtener historial de accesos:', err);
            throw err;
        }
    }

    static async create(id_registro, id_usuario, fecha_acceso, hora_acceso) {
        try {
            const [result] = await db.query(
                'INSERT INTO historial_accesos (id_registro, id_usuario, fecha_acceso, hora_acceso) VALUES (?, ?, ?, ?)',
                [id_registro, id_usuario, fecha_acceso, hora_acceso]
            );
            return result.insertId;
        } catch (err) {
            console.error('Error al crear historial de acceso:', err);
            throw err;
        }
    }

    static async getByIdUser(id) {
        try {
            const [rows] = await db.query(
                `SELECT * FROM historial_accesos 
                 WHERE id_usuario = ? 
                 ORDER BY fecha_acceso DESC, hora_acceso DESC 
                 LIMIT 1`,
                [id]
            );
            return rows[0];
        } catch (err) {
            console.error('Error al obtener historial de acceso por ID:', err);
            throw err;
        }
    }

    static async getAllByIdUser(id) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM historial_accesos WHERE id_usuario = ? ORDER BY fecha_acceso DESC, hora_acceso DESC',
                [id]
            );
            return rows;
        } catch (err) {
            console.error('Error al obtener historial de accesos por ID de usuario:', err);
            throw err;
        }
    }
}

module.exports = HistorialAccesos;

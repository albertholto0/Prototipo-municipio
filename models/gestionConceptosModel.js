const db = require('../config/database');

class Conceptos {
    static async getAll() {
        try {
            const [rows] = await db.query(
                'SELECT clave_concepto, clave_seccion, descripcion, tipo_servicio, cuota, periodicidad FROM conceptos');
            return rows;
        } catch (err) {
            console.error('Error en la consulta:', err);
            throw new Error('Error al obtener conceptos');
        }
    }

    static async create(clave_concepto, clave_seccion, descripcion, tipo_servicio, cuota, periodicidad) {
        try {
            const [result] = await db.query(
                'INSERT INTO conceptos (clave_concepto, clave_seccion, descripcion, tipo_servicio, cuota, periodicidad) VALUES (?, ?, ?, ?, ?, ?)',
                [clave_concepto, clave_seccion, descripcion, tipo_servicio, cuota, periodicidad]
            );
            return result.insertId;
        } catch (err) {
            console.error('Error al crear concepto:', err);
            throw err;
        }
    }
}

module.exports = Conceptos;
// Este modelo se encarga de interactuar con la base de datos para obtener los conceptos    
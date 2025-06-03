const db = require('../config/database');

class Conceptos {
    static async getAll() {
        try {
            const [rows] = await db.query(
                'SELECT clave_concepto, clave_seccion, nombre_conceptos, descripcion, tipo_servicio FROM conceptos');
            return rows;
        } catch (err) {
            console.error('Error en la consulta:', err);
            throw new Error('Error al obtener conceptos');
        }
    }

    static async create(clave_concepto, clave_seccion, nombre_conceptos, descripcion, tipo_servicio) {
        try {
            const [result] = await db.query(
                'INSERT INTO conceptos (clave_concepto, clave_seccion, nombre_conceptos, descripcion, tipo_servicio) VALUES (?, ?, ?, ?, ?)',
                [clave_concepto, clave_seccion, nombre_conceptos, descripcion, tipo_servicio]
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
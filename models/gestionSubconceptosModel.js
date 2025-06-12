const db = require('../config/database');

class Subconceptos {
    static async getAll() {
        try {
            const [rows] = await db.query(
                'SELECT clave_subconcepto, clave_concepto, descripcion, tipo_servicio, cuota, periodicidad FROM subconceptos'
            );
            return rows;
        } catch (err) {
            console.error('Error en la consulta:', err);
            throw new Error('Error al obtener subconceptos');
        }
    }

    static async create(clave_subconcepto, clave_concepto, descripcion, tipo_servicio, cuota, periodicidad) {
        try {
            const [result] = await db.query(
                'INSERT INTO subconceptos (clave_subconcepto, clave_concepto, descripcion, tipo_servicio, cuota, periodicidad) VALUES (?, ?, ?, ?, ?, ?)',
                [clave_subconcepto, clave_concepto, descripcion, tipo_servicio, cuota, periodicidad]
            );
            return result.insertId;
        } catch (err) {
            console.error('Error al crear subconcepto:', err);
            throw err;
        }
    }
}

module.exports = Subconceptos;
// Este modelo se encarga de interactuar con la base de datos para obtener y crear subconceptos
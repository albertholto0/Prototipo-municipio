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

    static async getById(clave_subconcepto) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM subconceptos WHERE clave_subconcepto = ?',
                [clave_subconcepto]
            );
            return rows[0];
        } catch (err) {
            console.error('Error al obtener subconcepto:', err);
            throw new Error('Error al obtener subconcepto');
        }
    }

    static async update(clave_subconcepto_actual, nueva_clave_subconcepto, nueva_clave_concepto, descripcion, tipo_servicio, cuota, periodicidad) {
        try {
            const [result] = await db.query(
                'UPDATE subconceptos SET clave_subconcepto = ?, clave_concepto = ?, descripcion = ?, tipo_servicio = ?, cuota = ?, periodicidad = ? WHERE clave_subconcepto = ?',
                [nueva_clave_subconcepto, nueva_clave_concepto, descripcion, tipo_servicio, cuota, periodicidad, clave_subconcepto_actual]
            );
            return result.affectedRows > 0;
        } catch (err) {
            console.error('Error al actualizar subconcepto:', err);
            throw err;
        }
    }

    static async delete(clave_subconcepto) {
        try {
            const [result] = await db.query(
                'DELETE FROM subconceptos WHERE clave_subconcepto = ?',
                [clave_subconcepto]
            );
            return result.affectedRows > 0;
        } catch (err) {
            console.error('Error al eliminar subconcepto:', err);
            throw err;
        }
    }
}

module.exports = Subconceptos;
// Este modelo se encarga de interactuar con la base de datos para obtener y crear subconceptos
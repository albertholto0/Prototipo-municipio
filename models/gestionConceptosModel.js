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

    static async update(clave_seccion, clave_concepto, descripcion, tipo_servicio, cuota, periodicidad) {
        try {
            await db.query(
                'UPDATE conceptos SET clave_seccion = ?, descripcion = ?, tipo_servicio = ?, cuota = ?, periodicidad = ? WHERE clave_concepto = ?',
                [clave_seccion, descripcion, tipo_servicio, cuota, periodicidad, clave_concepto]
            );
        } catch (err) {
            console.error('Error al actualizar concepto:', err);
            throw err;
        }
    }

    static async checkSubconceptos(clave_concepto) {
        try {
            const [rows] = await db.query(
                'SELECT COUNT(*) AS count FROM subconceptos WHERE clave_concepto = ?',
                [clave_concepto]
            );
            return rows[0].count > 0;
        } catch (err) {
            console.error('Error al verificar subconceptos:', err);
            throw err;
        }
    }

    static async updateClaveConcepto(oldClave, newClave, clave_seccion, descripcion, tipo_servicio, cuota, periodicidad) {
        try {
            await db.query('START TRANSACTION');
            
            const [existing] = await db.query(
                'SELECT 1 FROM conceptos WHERE clave_concepto = ?',
                [newClave]
            );
            
            if (existing.length > 0) {
                throw new Error('La nueva clave de concepto ya existe');
            }
            
            await db.query(
                'UPDATE conceptos SET clave_concepto = ?, clave_seccion = ?, descripcion = ?, tipo_servicio = ?, cuota = ?, periodicidad = ? WHERE clave_concepto = ?',
                [newClave, clave_seccion, descripcion, tipo_servicio, cuota, periodicidad, oldClave]
            );
            
            await db.query('COMMIT');
        } catch (err) {
            await db.query('ROLLBACK');
            console.error('Error al actualizar clave de concepto:', err);
            throw err;
        }
    }

    static async delete(clave_concepto) {
        try {
            await db.query('DELETE FROM conceptos WHERE clave_concepto = ?', [clave_concepto]);
        } catch (err) {
            console.error('Error al eliminar concepto:', err);
            throw err;
        }
    }
}

module.exports = Conceptos;
// Este modelo se encarga de interactuar con la base de datos para obtener los conceptos

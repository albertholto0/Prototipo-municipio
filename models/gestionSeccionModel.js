const db = require('../config/database');

class Seccion {
    static async getAll(){
        try {
            const [rows] = await db.query(`
                SELECT
                    clave_seccion,
                    clave_subcuenta, 
                    descripcion, estado
                FROM secciones
            `);
            return rows;
        } catch (err) {
            console.error('Error en la consulta:', err);
            throw new Error('Error al obtener secciones');
        }
    }

    static async deleteSeccion(clave_seccion) {
        try {
            await db.query('UPDATE secciones SET estado = NOT estado WHERE clave_seccion = ?', [clave_seccion]);
        } catch (err) {
            console.error('Error al eliminar la sección:', err);
            throw new Error('Error al eliminar la sección');
        }
    }

    static async setSeccion(clave_subcuenta, clave_seccion, descripcion) {
        try {
            const [result] = await db.query(
                'INSERT INTO secciones (clave_subcuenta, clave_seccion, descripcion, estado) VALUES (?, ?, ?, 1)',
                [clave_subcuenta, clave_seccion, descripcion]
            );
            return result.insertId;
        } catch (err) {
            console.error('Error al crear la sección:', err);
            throw new Error('Error al crear la sección');
        }
    }

    static async getSeccionById(clave_seccion) {
        try {
            const [rows] = await db.query('SELECT * FROM secciones WHERE clave_seccion = ?', [clave_seccion]);
            if (rows.length === 0) {
                throw new Error('Sección no encontrada');
            }
            return rows[0];
        } catch (err) {
            console.error('Error al obtener la sección:', err);
            throw new Error('Error al obtener la sección');
        }
    }

    static async putSeccion(clave_seccion, clave_subcuenta, descripcion) {
        try {
            await db.query(
                'UPDATE secciones SET clave_subcuenta = ?, descripcion = ? WHERE clave_seccion = ?',
                [clave_subcuenta, descripcion, clave_seccion]
            );
        } catch (err) {
            console.error('Error al actualizar la sección:', err);
            throw new Error('Error al actualizar la sección');
        }
    }
}

module.exports = Seccion;
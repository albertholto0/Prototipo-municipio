const db = require('../config/database');

class Seccion {
    static async getAll(){
        try {
            const [rows] = await db.query(`
                SELECT
                    clave_seccion,
                    clave_subcuenta, 
                    descripcion
                FROM secciones
            `);
            return rows;
        } catch (err) {
            console.error('Error en la consulta:', err);
            throw new Error('Error al obtener secciones');
        }
    }

    static async getById(clave_seccion) {
        try {
            const [rows] = await db.query(`
                SELECT
                    clave_seccion,
                    clave_subcuenta, 
                    nombre_seccion
                FROM secciones
                WHERE clave_seccion = ?
            `, [clave_seccion]);
            return rows[0];
        } catch (err) {
            console.error('Error en la consulta:', err);
            throw new Error('Error al buscar la sección');
        }
    }
}

module.exports = Seccion;
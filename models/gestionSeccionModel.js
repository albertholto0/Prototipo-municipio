const db = require('../config/database');

class Seccion {
    static async getAll(){
        try {
            const [rows] = await db.query(`
                SELECT
                    clave_seccion,
                    clave_subcuenta, 
                    nombre_seccion
                FROM secciones
            `);
            return rows;
        } catch (err) {
            console.error('Error en la consulta:', err);
            throw new Error('Error al obtener secciones');
        }
    }
}

module.exports = Seccion;
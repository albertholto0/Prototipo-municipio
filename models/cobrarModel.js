const db = require('../config/database');

class Cobrar {
    static async getContribuyente(){
        try {
            const [rows] = await db.query(`
                SELECT
                    nombre_completo
                FROM contribuyentes
            `);
            return rows;
        } catch (err) {
            console.error('Error en la consulta:', err);
            throw new Error('Error al obtener contribuyentes');
        }
    }
}

module.exports = Cobrar;
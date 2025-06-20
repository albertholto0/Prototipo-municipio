const db = require('../config/database');

class BaseCatastral {
    static async getAll() {
        try {
            const [rows] = await db.query(
                'SELECT * FROM bases_catastrales');
            return rows;
        } catch (err) {
            console.error('Error en la consulta:', err);
            throw new Error('Error al obtener bases catastrales');
        }
    }
}

module.exports = BaseCatastral;
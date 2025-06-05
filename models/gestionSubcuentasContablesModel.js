const db = require('../config/database');

class SubcuentasContables {
    static async getAll() {
        try {
            const [rows] = await db.query('SELECT clave_subcuenta, clave_cuenta_contable, nombre_subcuentas, estado FROM subcuentas_contables');
            return rows;
        } catch (err) {
            console.error('Error en la consulta:', err);
            throw new Error('Error al obtener subcuentas contables');
        }
    }
}

module.exports = SubcuentasContables;
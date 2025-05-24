const db = require('../config/database');

class CuentasContables {
    static async getAll(){
        try {
            const [rows] = await db.query('SELECT cuenta_contable, nombre_cuenta FROM cuentas_contables');
            return rows;
        } catch (err) {
            console.error('Error en la consulta:' , err);
            throw new Error('Error al obtener cuentas contables');
        }
    }
}
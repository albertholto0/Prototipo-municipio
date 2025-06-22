const db = require('../config/database');

class CuentasContables {
    static async getAll(){
        try {
            const [rows] = await db.query('SELECT clave_cuenta_contable, nombre_cuentaContable, estado FROM cuentas_contables');
            return rows;
        } catch (err) {
            console.error('Error en la consulta:' , err);
            throw new Error('Error al obtener cuentas contables');
        }
    }
}
    
module.exports = CuentasContables;
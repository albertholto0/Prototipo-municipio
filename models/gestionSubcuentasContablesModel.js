const db = require('../config/database');

class SubcuentasContables {
    static async getAll() {
        try {
            // JOIN para obtener la clave_cuentaContable desde cuentas_contables
            const [rows] = await db.query(`
                SELECT 
                    subcuentas_contables.clave_subcuenta, 
                    cuentas_contables.clave_cuentaContable, 
                    subcuentas_contables.nombre, 
                    subcuentas_contables.estado 
                FROM subcuentas_contables 
                JOIN cuentas_contables 
                ON subcuentas_contables.id_cuentaContable = cuentas_contables.id_cuentaContable
            `);
            return rows;
        } catch (err) {
            console.error('Error en la consulta:', err);
            throw new Error('Error al obtener subcuentas contables');
        }
    }

    static async deleteSubcuenta(clave_subcuenta) {
        try {
            await db.query('UPDATE subcuentas_contables SET estado = NOT estado WHERE clave_subcuenta = ?', [clave_subcuenta]);
        } catch (err) {
            console.error('Error al eliminar la subcuenta:', err);
            throw new Error('Error al eliminar la subcuenta');
        }
    }

    static async setSucuenta(id_cuentaContable, clave_subcuenta, nombre) {
        try {
            const [result] = await db.query(
                'INSERT INTO subcuentas_contables (id_cuentaContable, clave_subcuenta, nombre, estado) VALUES (?, ?, ?, 1)',
                [id_cuentaContable, clave_subcuenta, nombre]
            );
            return result.insertId;
        } catch (err) {
            console.error('Error al crear la subcuenta:', err);
            throw new Error('Error al crear la subcuenta');
        }
    }

    static async getSubcuentaById(clave_subcuenta) {
        try {
            // JOIN para obtener la clave_cuentaContable
            const [rows] = await db.query(`
                SELECT 
                    subcuentas_contables.clave_subcuenta, 
                    cuentas_contables.clave_cuentaContable, 
                    subcuentas_contables.nombre, 
                    subcuentas_contables.estado,
                    subcuentas_contables.id_cuentaContable
                FROM subcuentas_contables
                JOIN cuentas_contables ON subcuentas_contables.id_cuentaContable = cuentas_contables.id_cuentaContable
                WHERE subcuentas_contables.clave_subcuenta = ?
            `, [clave_subcuenta]);
            if (rows.length === 0) {
                throw new Error('Subcuenta no encontrada');
            }
            return rows[0];
        } catch (err) {
            console.error('Error al obtener la subcuenta:', err);
            throw new Error('Error al obtener la subcuenta');
        }
    }

    static async putSubcuenta(clave_subcuenta, id_cuentaContable, nombre) {
        try {
            await db.query(
                'UPDATE subcuentas_contables SET id_cuentaContable = ?, nombre = ? WHERE clave_subcuenta = ?',
                [id_cuentaContable, nombre, clave_subcuenta]
            );
        } catch (err) {
            console.error('Error al actualizar la subcuenta:', err);
            throw new Error('Error al actualizar la subcuenta');
        }
    }
}

module.exports = SubcuentasContables;
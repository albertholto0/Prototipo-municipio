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

    static async deleteSubcuenta(clave_subcuenta) {
        try {
            await db.query('UPDATE subcuentas_contables SET estado = NOT estado WHERE clave_subcuenta = ?', [clave_subcuenta]);
        } catch (err) {
            console.error('Error al eliminar la subcuenta:', err);
            throw new Error('Error al eliminar la subcuenta');
        }
    }

    static async setSucuenta(clave_cuenta_contable, clave_subcuenta, nombre_subcuentas) {
        try {
            const [result] = await db.query(
                'INSERT INTO subcuentas_contables (clave_cuenta_contable, clave_subcuenta, nombre_subcuentas, estado) VALUES (?, ?, ?, 1)',
                [clave_cuenta_contable, clave_subcuenta, nombre_subcuentas]
            );
            return result.insertId;
        } catch (err) {
            console.error('Error al crear la subcuenta:', err);
            throw new Error('Error al crear la subcuenta');
        }
    }

    static async getSubcuentaById(clave_subcuenta) {
        try {
            const [rows] = await db.query('SELECT * FROM subcuentas_contables WHERE clave_subcuenta = ?', [clave_subcuenta]);
            if (rows.length === 0) {
                throw new Error('Subcuenta no encontrada');
            }
            return rows[0];
        } catch (err) {
            console.error('Error al obtener la subcuenta:', err);
            throw new Error('Error al obtener la subcuenta');
        }
    }
    static async putSubcuenta(clave_subcuenta, clave_cuenta_contable, nombre_subcuentas) {
        try {
            await db.query(
                'UPDATE subcuentas_contables SET clave_cuenta_contable = ?, nombre_subcuentas = ? WHERE clave_subcuenta = ?',
                [clave_cuenta_contable, nombre_subcuentas, clave_subcuenta]
            );
        } catch (err) {
            console.error('Error al actualizar la subcuenta:', err);
            throw new Error('Error al actualizar la subcuenta');
        }
    }
}

module.exports = SubcuentasContables;
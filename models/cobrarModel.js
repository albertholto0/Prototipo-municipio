const db = require('../config/database');

class Cobrar {
    static async getCuentas() {
        try {
            const [rows] = await db.query(`
                SELECT clave_cuenta_contable, nombre_cuentaContable FROM cuentas_contables
            `);
            return rows;
        } catch (err) {
            console.error('Error en la consulta:', err);
            throw new Error('Error al obtener cuentas');
        }
    }

    static async getSubcuentas(cuentaId) {
        try {
            const [rows] = await db.query('SELECT clave_subcuenta, nombre_subcuentas FROM subcuentas_contables WHERE clave_cuenta_contable = ?', [cuentaId]);
            return rows;
        } catch (err) {
            console.error('Error en la consulta:', err);
            throw new Error('Error al obtener subcuentas');
        }
    }

    static async getSecciones(subcuentaId) {
        try {
            const [rows] = await db.query('SELECT clave_seccion, descripcion FROM secciones WHERE clave_subcuenta = ?', [subcuentaId]);
            return rows;
        } catch (err) {
            console.error('Error en la consulta:', err);
            throw new Error('Error al obtener secciones');
        }
    }

    static async getConceptos(seccionId) {
        try {
            const [rows] = await db.query('SELECT clave_concepto, descripcion FROM conceptos WHERE clave_seccion = ?', [seccionId]);
            return rows;
        } catch (err) {
            console.error('Error en la consulta:', err);
            throw new Error('Error al obtener conceptos');
        }
    }

    static async getSubconceptos(conceptoId) {
        try {
            const [rows] = await db.query('SELECT clave_subconcepto, descripcion FROM subconceptos WHERE clave_concepto = ?', [conceptoId]);
            return rows;
        } catch (err) {
            console.error('Error en la consulta:', err);
            throw new Error('Error al obtener subconceptos');
        }
    }

    static async getConexiones(contribuyenteId){
        try {
            const [rows] = await db.query(`
                SELECT c.cuenta 
                FROM conexiones c
                JOIN contribuyente cc ON c.id_contribuyente = cc.id_contribuyente
                WHERE cc.id_contribuyente = ?
            `, [contribuyenteId]);
            return rows;
        } catch (err) {
            console.error('Error en la consulta:', err);
            throw new Error('Error al obtener conexiones');
        }
    }
}

module.exports = Cobrar;
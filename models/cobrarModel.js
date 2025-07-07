const db = require('../config/database');

class Cobrar {
    static async getCuentas() {
        try {
            const [rows] = await db.query(`
                SELECT id_cuentaContable, clave_cuentaContable, nombre_cuentaContable, estado FROM cuentas_contables
            `);
            return rows;
        } catch (err) {
            console.error('Error en la consulta:', err);
            throw new Error('Error al obtener cuentas');
        }
    }

    static async getSubcuentas(cuentaId) {
        try {
            const [rows] = await db.query('SELECT clave_subcuenta, nombre FROM subcuentas_contables WHERE id_cuentaContable = ?', [cuentaId]);
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

    static async getConexiones(contribuyenteId) {
        try {
            const [rows] = await db.query(`
                SELECT c.cuenta, c.id_conexion
                FROM conexiones c
                JOIN contribuyentes cc ON c.id_contribuyente = cc.id_contribuyente
                WHERE cc.id_contribuyente = ?
            `, [contribuyenteId]);
            return rows;
        } catch (err) {
            console.error('Error en la consulta:', err);
            throw new Error('Error al obtener conexiones');
        }
    }

    static async getBaseCatastrales(contribuyenteId) {
        try {
            const [rows] = await db.query(`
                SELECT bc.cuenta, bc.id_base_catastral
                FROM bases_catastrales bc
                JOIN contribuyentes c ON bc.id_contribuyente = c.id_contribuyente
                WHERE c.id_contribuyente = ?
            `, [contribuyenteId]);
            return rows;
        } catch (err) {
            console.error('Error en la consulta:', err);
            throw new Error('Error al obtener bases catastrales');
        }
    }

    static async getIdRecibo() {
        try {
            const [rows] = await db.query(`
            SELECT MAX(id_recibo) AS ultimo_id FROM recibos
        `);
            return rows[0].ultimo_id || 0; // Regresa el último id, sin sumar 1
        } catch (err) {
            console.error('Error en la consulta:', err);
            throw new Error('Error al obtener folio');
        }
    }

    static async setRecibo(folio, fecha, ejercicioFiscal, periodo, id_contribuyente, clave_cuentaContable, clave_subcuenta, clave_seccion, clave_concepto, clave_subconcepto, id_estimulo_fiscal, monto, monto_total_letras, descripcion, subtotal, forma_de_pago, id_base_catastral, id_establecimiento, id_conexion) {
        try {
            const [result] = await db.query(`
                INSERT INTO recibos (folio, fecha_recibo, ejercicio_fiscal, ejercicio_periodo, id_contribuyente, id_cuenta_contable, id_subcuenta, id_seccion, id_concepto, id_subconcepto, id_estimulo_fiscal, monto_total, monto_total_letras, descripcion, subtotal, forma_de_pago, id_base_catastral, id_establecimiento, id_conexion, estado_recibo, id_usuario)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'vigente', 1)
            `, [folio, fecha, ejercicioFiscal, periodo, id_contribuyente, clave_cuentaContable, clave_subcuenta, clave_seccion, clave_concepto, clave_subconcepto, id_estimulo_fiscal, monto, monto_total_letras, descripcion, subtotal, forma_de_pago, id_base_catastral, id_establecimiento, id_conexion]);
            return result;
        } catch (err) {
            console.error('Error en la consulta:', err);
            throw new Error('Error al insertar recibo');
        }
    }
}

module.exports = Cobrar;
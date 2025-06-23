const db = require("../config/database");

class CorteCaja {
    static async getAll() {
        
        try {
            const [rows] = await db.query(`
        SELECT
    recibos.folio,
    (SELECT cuentas_contables.nombre FROM cuentas_contables WHERE cuentas_contables.clave_cuenta = recibos.id_cuenta_contable),
    (SELECT conceptos.descripcion FROM conceptos WHERE conceptos.clave_concepto = recibos.id_concepto),
    recibos.forma_de_pago,
    recibos.subtotal,
    (
        (SELECT estimulos_fiscales.porcentaje_descuento FROM estimulos_fiscales WHERE estimulos_fiscales.id_estimulo_fiscal = recibos.id_estimulo_fiscal) +
        (SELECT estimulos_fiscales.porcentaje_descuento FROM estimulos_fiscales WHERE estimulos_fiscales.id_estimulo_fiscal = recibos.id_estimulo_fiscal_adicional)
    ) * recibos.subtotal / 100,
    recibos.monto_total
FROM recibos
WHERE recibos.estado_recibo = 'vigente';
        `);
            return rows;
        } catch (err) {S
            console.error("Error en la consulta:", err);
            throw new Error("Error al obtener corte de caja");
        }
    }
}

module.exports = CorteCaja;
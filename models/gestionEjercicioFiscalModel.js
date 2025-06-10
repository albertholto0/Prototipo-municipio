const db = require('../config/database');

class EjercicioFiscal {
    static async getAll(){
        try {
            const [rows] = await db.query('SELECT anio AS "Año", fecha_inicio AS "Fecha Inicio", fecha_fin AS "Fecha Fin", estado AS "Estado", presupuesto_ingresos AS "Presupuesto Ingresos", presupuesto_ejecutado AS "Presupuesto Ejecutado", observaciones AS "Observaciones" FROM ejercicios_fiscales;');
            return rows;
        } catch (err) {
            console.error('Error en la consulta:', err);
            throw new Error('Error al obtener ejerciccios fiscales');
        }
    }
}

EjercicioFiscal = CuentasContables;

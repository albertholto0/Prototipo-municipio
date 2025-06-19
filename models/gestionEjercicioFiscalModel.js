const db = require('../config/database');

class EjercicioFiscal {
    static async getAll(){
        try {
            const [rows] = await db.query(`
              SELECT 
                id_ejercicio,
                anio,
                fecha_inicio,
                fecha_fin,
                estado,
                proyeccion_ingreso,
                ingreso_recaudado,
                observaciones
              FROM ejercicios_fiscales;
            `);
            return rows;
        } catch (err) {
            console.error('Error en la consulta:', err);
            throw new Error('Error al obtener ejercicios fiscales');
        }
    }
}
module.exports = EjercicioFiscal;
const db = require('../config/database');

class EjercicioFiscal {
// En gestionEjercicioFiscalModel.js
static async getAll() {
    try {
        console.log('Intentando conectar a la base de datos...');
        const [rows] = await db.query(`
            SELECT 
                id_ejercicio,
                anio,
                DATE_FORMAT(fecha_inicio, '%Y-%m-%d') as fecha_inicio,
                DATE_FORMAT(fecha_fin, '%Y-%m-%d') as fecha_fin,
                estado,
                proyeccion_ingreso AS presupuesto_asignado,
                ingreso_recaudado AS presupuesto_ejecutado,
                observaciones
            FROM ejercicios_fiscales;
        `);
        console.log('Consulta exitosa, resultados:', rows);
        return rows;
    } catch (err) {
        console.error('Error completo en la consulta SQL:', err);
        throw new Error('Error al obtener ejercicios fiscales');
    }
}
}
module.exports = EjercicioFiscal;
const db = require('../config/database');

class EjercicioFiscal {
  // Obtener todos los ejercicios fiscales
  static async getAll() {
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
        FROM ejercicios_fiscales
      `);
      return rows;
    } catch (err) {
      console.error('Error en la consulta:', err);
      throw new Error('Error al obtener los ejercicios fiscales');
    }
  }

  // Obtener un ejercicio fiscal por ID
  static async getById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM ejercicios_fiscales WHERE id_ejercicio = ?', [id]);
      if (rows.length === 0) {
        throw new Error('Ejercicio fiscal no encontrado');
      }
      return rows[0];
    } catch (err) {
      console.error('Error al obtener el ejercicio fiscal:', err);
      throw new Error('Error al obtener el ejercicio fiscal');
    }
  }

  // Crear nuevo ejercicio fiscal
  static async create({ anio, fecha_inicio, fecha_fin, estado, proyeccion_ingreso, ingreso_recaudado, observaciones }) {
    try {
      const [result] = await db.query(
        'INSERT INTO ejercicios_fiscales (anio, fecha_inicio, fecha_fin, estado, proyeccion_ingreso, ingreso_recaudado, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [anio, fecha_inicio, fecha_fin, estado, proyeccion_ingreso, ingreso_recaudado, observaciones || null]
      );
      return { id_ejercicio: result.insertId, anio, fecha_inicio, fecha_fin, estado, proyeccion_ingreso, ingreso_recaudado, observaciones };
    } catch (err) {
      console.error('Error al crear ejercicio fiscal:', err);
      throw new Error('Error al crear el ejercicio fiscal');
    }
  }

  // Actualizar un ejercicio fiscal
  static async update(id, { anio, fecha_inicio, fecha_fin, estado, proyeccion_ingreso, ingreso_recaudado, observaciones }) {
    try {
      const [result] = await db.query(
        `UPDATE ejercicios_fiscales SET 
          anio = ?, fecha_inicio = ?, fecha_fin = ?, estado = ?, 
          proyeccion_ingreso = ?, ingreso_recaudado = ?, observaciones = ?
        WHERE id_ejercicio = ?`,
        [anio, fecha_inicio, fecha_fin, estado, proyeccion_ingreso, ingreso_recaudado, observaciones || null, id]
      );
      return result.affectedRows > 0;
    } catch (err) {
      console.error('Error al actualizar el ejercicio fiscal:', err);
      throw new Error('Error al actualizar el ejercicio fiscal');
    }
  }

  // Eliminar un ejercicio fiscal
  static async delete(id) {
    try {
      await db.query('DELETE FROM ejercicios_fiscales WHERE id_ejercicio = ?', [id]);
    } catch (err) {
      console.error('Error al eliminar el ejercicio fiscal:', err);
      throw new Error('Error al eliminar el ejercicio fiscal');
    }
  }
}

module.exports = EjercicioFiscal;
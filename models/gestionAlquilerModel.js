// File: models/gestionAlquilerModel.js
//Sergio Elias Robles Ignacio 
const db = require('../config/database');

class Alquiler {
  static async getAll() {
    try {
      const [rows] = await db.query(`
        SELECT
          id_alquiler,
          fecha_inicio,
          fecha_fin,
          numero_viajes,
          kilometros_recorridos,
          horometro_inicio,
          horometro_fin,
          tipo_trabajo,
          concepto,
          tarifa_base,
          monto_total,
          id_recibo
        FROM alquiler
      `);
      return rows;
    } catch (err) {
      console.error('Error en la consulta:', err);
      throw new Error('Error al obtener alquileres');
    }
  }

  static async setAlquiler(
    fecha_inicio,
    fecha_fin,
    numero_viajes,
    kilometros_recorridos,
    horometro_inicio,
    horometro_fin,
    tipo_trabajo,
    concepto,
    tarifa_base,
    monto_total,
    id_recibo
  ) {
    try {
      const [result] = await db.query(
        `INSERT INTO alquiler (
          fecha_inicio,
          fecha_fin,
          numero_viajes,
          kilometros_recorridos,
          horometro_inicio,
          horometro_fin,
          tipo_trabajo,
          concepto,
          tarifa_base,
          monto_total,
          id_recibo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          fecha_inicio,
          fecha_fin,
          numero_viajes,
          kilometros_recorridos,
          horometro_inicio,
          horometro_fin,
          tipo_trabajo,
          concepto,
          tarifa_base,
          monto_total,
          id_recibo
        ]
      );
      return { id_alquiler: result.insertId };
    } catch (err) {
      console.error('Error al registrar alquiler:', err);
      throw new Error('Error al registrar alquiler');
    }
  }

  static async updateAlquiler(
    id,
    fecha_inicio,
    fecha_fin,
    numero_viajes,
    kilometros_recorridos,
    horometro_inicio,
    horometro_fin,
    tipo_trabajo,
    concepto,
    tarifa_base,
    monto_total,
    id_recibo
  ) {
    try {
      const [result] = await db.query(
        `UPDATE alquiler SET
          fecha_inicio = ?,
          fecha_fin = ?,
          numero_viajes = ?,
          kilometros_recorridos = ?,
          horometro_inicio = ?,
          horometro_fin = ?,
          tipo_trabajo = ?,
          concepto = ?,
          tarifa_base = ?,
          monto_total = ?,
          id_recibo = ?
        WHERE id_alquiler = ?`,
        [
          fecha_inicio,
          fecha_fin,
          numero_viajes,
          kilometros_recorridos,
          horometro_inicio,
          horometro_fin,
          tipo_trabajo,
          concepto,
          tarifa_base,
          monto_total, 
          id_recibo,
          id
        ]
      );
      return result;
    } catch (err) {
      console.error('Error al actualizar alquiler:', err);
      throw new Error('Error al actualizar alquiler');
    }
  }

  static async deleteAlquiler(id) {
    try {
      const [result] = await db.query(
        'DELETE FROM alquiler WHERE id_alquiler = ?',
        [id]
      );
      return result;
    } catch (err) {
      console.error('Error al eliminar alquiler:', err);
      throw new Error('Error al eliminar alquiler');
    }
  }
}

module.exports = Alquiler;
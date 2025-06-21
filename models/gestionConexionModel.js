//File: models/gestionConexionModel.js
//Sergio Elias Robles Ignacio 
const db = require('../config/database');

class Conexion {
  // Obtener todas las conexiones
  static async getAll() {
    try {
      const [rows] = await db.query(`
        SELECT 
          id_conexion,
          fecha_conexion,
          id_contribuyente,
          cuenta,
          tipo,
          uso,
          ubicacion,
          barrio
        FROM conexiones
      `);
      return rows;
    } catch (err) {
      console.error('Error al obtener conexiones:', err);
      throw new Error('Error al obtener conexiones');
    }
  }

  // Registrar una nueva conexión
  static async setConexion(
    fecha_conexion,
    id_contribuyente,
    cuenta,
    tipo,
    uso,
    ubicacion,
    barrio
  ) {
    try {
      const [result] = await db.query(
        `INSERT INTO conexiones 
          (fecha_conexion, id_contribuyente, cuenta, tipo, uso, ubicacion, barrio)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [fecha_conexion, id_contribuyente, cuenta, tipo, uso, ubicacion, barrio]
      );
      return { id_conexion: result.insertId };
    } catch (err) {
      console.error('Error al registrar conexión:', err);
      throw new Error('Error al registrar conexión');
    }
  }

  // Actualizar una conexión existente
  static async putConexion(
    id,
    fecha_conexion,
    id_contribuyente,
    cuenta,
    tipo,
    uso,
    ubicacion,
    barrio
  ) {
    try {
      const [result] = await db.query(
        `UPDATE conexiones SET 
          fecha_conexion = ?, 
          id_contribuyente = ?, 
          cuenta = ?, 
          tipo = ?, 
          uso = ?, 
          ubicacion = ?, 
          barrio = ?
         WHERE id_conexion = ?`,
        [fecha_conexion, id_contribuyente, cuenta, tipo, uso, ubicacion, barrio, id]
      );
      return result.affectedRows > 0;
    } catch (err) {
      console.error('Error al actualizar conexión:', err);
      throw new Error('Error al actualizar conexión');
    }
  }

  // Eliminar una conexión
  static async deleteConexion(id) {
    try {
      await db.query('DELETE FROM conexiones WHERE id_conexion = ?', [id]);
    } catch (err) {
      console.error('Error al eliminar conexión:', err);
      throw new Error('Error al eliminar conexión');
    }
  }

  // Obtener una conexión por ID
  static async getConexionById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM conexiones WHERE id_conexion = ?', [id]);
      if (rows.length === 0) {
        throw new Error('Conexión no encontrada');
      }
      return rows[0];
    } catch (err) {
      console.error('Error al obtener la conexión:', err);
      throw new Error('Error al obtener la conexión');
    }
  }
}

module.exports = Conexion;
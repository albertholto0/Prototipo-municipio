const db = require("../config/database");

class Establecimiento {
  static async getAll() {
    try {
      const [rows] = await db.query(`
        SELECT 
          e.id_establecimiento,
          e.nombre_establecimiento,
          e.direccion,
          e.codigo_postal,
          e.fecha_apertura,
          e.giro_negocio,
          CONCAT(c.nombre, ' ', c.apellido_paterno, ' ', c.apellido_materno) AS contribuyente
        FROM establecimientos e
        JOIN contribuyente c ON e.id_contribuyente = c.id_contribuyente
      `);
      return rows;
    } catch (err) {
      console.error("Error al obtener establecimientos:", err);
      throw new Error("Error al obtener establecimientos");
    }
  }

  static async getEstablecimientoById(id) {
    try {
      const [rows] = await db.query(
        "SELECT * FROM establecimientos WHERE id_establecimiento = ?",
        [id]
      );
      if (rows.length === 0) {
        throw new Error("Establecimiento no encontrado");
      }
      return rows[0];
    } catch (err) {
      console.error("Error al obtener establecimiento:", err);
      throw new Error("Error al obtener establecimiento");
    }
  }

  static async setEstablecimiento(
    nombre_establecimiento,
    direccion,
    barrio,
    localidad,
    codigo_postal,
    fecha_apertura,
    giro_negocio,
    id_contribuyente
  ) {
    try {
      const [result] = await db.query(
        `
        INSERT INTO establecimientos 
        (nombre_establecimiento, direccion, barrio, localidad, codigo_postal, fecha_apertura, giro_negocio, id_contribuyente)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          nombre_establecimiento,
          direccion,
          barrio,
          localidad,
          codigo_postal,
          fecha_apertura,
          giro_negocio,
          id_contribuyente,
        ]
      );
      return result.insertId;
    } catch (err) {
      console.error("Error al crear establecimiento:", err);
      throw new Error("No se pudo crear el establecimiento");
    }
  }

  static async deleteEstablecimiento(id) {
    try {
      await db.query(
        "DELETE FROM establecimientos WHERE id_establecimiento = ?",
        [id]
      );
    } catch (err) {
      console.error("Error al eliminar establecimiento:", err);
      throw new Error("No se pudo eliminar el establecimiento");
    }
  }

  static async putEstablecimiento(
    id,
    nombre_establecimiento,
    direccion,
    barrio,
    localidad,
    codigo_postal,
    fecha_apertura,
    giro_negocio,
    id_contribuyente
  ) {
    try {
      const [result] = await db.query(
        `
        UPDATE establecimientos 
        SET nombre_establecimiento = ?, direccion = ?, barrio = ?, localidad = ?, codigo_postal = ?, 
            fecha_apertura = ?, giro_negocio = ?, id_contribuyente = ?
        WHERE id_establecimiento = ?
      `,
        [
          nombre_establecimiento,
          direccion,
          barrio,
          localidad,
          codigo_postal,
          fecha_apertura,
          giro_negocio,
          id_contribuyente,
          id,
        ]
      );
      return result.affectedRows > 0;
    } catch (err) {
      console.error("Error al actualizar establecimiento:", err);
      throw new Error("No se pudo actualizar el establecimiento");
    }
  }
}

module.exports = Establecimiento;

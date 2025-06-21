const db = require("../config/database");

class Establecimiento {
  static async getAll(req, res) {
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
      res.json(rows);
    } catch (err) {
      console.error("Error al obtener establecimientos:", err);
      res.status(500).json({ error: "Error al obtener establecimientos" });
    }
  }

  static async getEstablecimientoById(req, res) {
    try {
      const { id } = req.params;
      const [rows] = await db.query(
        "SELECT * FROM establecimientos WHERE id_establecimiento = ?",
        [id]
      );
      if (rows.length === 0) {
        return res.status(404).json({ error: "Establecimiento no encontrado" });
      }
      res.json(rows[0]);
    } catch (err) {
      console.error("Error al obtener establecimiento:", err);
      res.status(500).json({ error: "Error al obtener establecimiento" });
    }
  }

  static async setEstablecimiento(req, res) {
    try {
      const {
        nombre_establecimiento,
        direccion,
        barrio,
        localidad,
        codigo_postal,
        fecha_apertura,
        giro_negocio,
        id_contribuyente,
      } = req.body;

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
      res.status(201).json({ insertId: result.insertId });
    } catch (err) {
      console.error("Error al crear establecimiento:", err);
      res.status(500).json({ error: "No se pudo crear el establecimiento" });
    }
  }

  static async deleteEstablecimiento(req, res) {
    try {
      const { id } = req.params;
      await db.query(
        "DELETE FROM establecimientos WHERE id_establecimiento = ?",
        [id]
      );
      res.json({ message: "Establecimiento eliminado correctamente" });
    } catch (err) {
      console.error("Error al eliminar establecimiento:", err);
      res.status(500).json({ error: "No se pudo eliminar el establecimiento" });
    }
  }

  static async putEstablecimiento(req, res) {
    try {
      const { id } = req.params;
      const {
        nombre_establecimiento,
        direccion,
        barrio,
        localidad,
        codigo_postal,
        fecha_apertura,
        giro_negocio,
        id_contribuyente,
      } = req.body;

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
      if (result.affectedRows > 0) {
        res.json({ message: "Establecimiento actualizado correctamente" });
      } else {
        res.status(404).json({ error: "Establecimiento no encontrado" });
      }
    } catch (err) {
      console.error("Error al actualizar establecimiento:", err);
      res
        .status(500)
        .json({ error: "No se pudo actualizar el establecimiento" });
    }
  }
}

module.exports = Establecimiento;

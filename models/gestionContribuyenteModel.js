// filepath: /home/rafaeldiaz/Documentos/Sexto Semestre/Ingenieria de Software II/Prototipo-municipio/models/gestionContribuyenteModel.js
const db = require("../config/database");

class Contribuyente {
  static async getAll() {
    try {
      const [rows] = await db.query(`
        SELECT
          id_contribuyente,
          nombre,
          apellido_paterno,
          apellido_materno,
          fecha_nacimiento,
          rfc,
          direccion,
          numero_calle,
          barrio,
          localidad,
          telefono
        FROM contribuyente
      `);
      return rows;
    } catch (err) {
      console.error("Error en la consulta:", err);
      throw new Error("Error al obtener contribuyentes");
    }
  }

  static async deleteContribuyente(id) {
    try {
      await db.query("DELETE FROM contribuyente WHERE id_contribuyente = ?", [
        id,
      ]);
    } catch (err) {
      throw new Error("Error al eliminar el contribuyente");
    }
  }

  static async setContribuyente(
    nombre,
    apellido_paterno,
    apellido_materno,
    fecha_nacimiento,
    telefono,
    calle,
    num_calle,
    barrio,
    localidad,
    codigo_postal,
    rfc
  ) {
    try {
      const [result] = await db.query(
        'INSERT INTO contribuyente (nombre, apellido_paterno, apellido_materno, fecha_nacimiento, telefono, direccion, numero_calle, barrio, localidad, codigo_postal, rfc, copia_credencial) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [nombre, apellido_paterno, apellido_materno, fecha_nacimiento, telefono, calle, num_calle, barrio, localidad, codigo_postal, rfc, "/home/imagenes/contribuyentes_ine"]
      );
      return result.insertId;
    } catch (err) {
      console.error("Error al crear usuario:", err);
    }
  }

  static async getContribuyenteById(id) {
    try {
      const [rows] = await db.query(
        "SELECT * FROM contribuyente WHERE id_contribuyente = ?",
        [id]
      );
      if (rows.length === 0) {
        throw new Error("Contribuyente no encontrado");
      }
      return rows[0];
    } catch (err) {
      console.error("Error al obtener el contribuyente:", err);
      throw new Error("Error al obtener el contribuyente");
    }
  }

  static async putContribuyente(
    id,
    nombre,
    apellido_paterno,
    apellido_materno,
    fecha_nacimiento,
    telefono,
    calle,
    num_calle,
    barrio,
    localidad,
    codigo_postal,
    rfc
  ) {
    try {
      const [result] = await db.query(
        "UPDATE contribuyente SET nombre = ?, apellido_paterno = ?, apellido_materno = ?, fecha_nacimiento = ?, telefono = ?, direccion = ?, numero_calle = ?, barrio = ?, localidad = ?, codigo_postal = ?, rfc = ? WHERE id_contribuyente = ?",
        [
          nombre,
          apellido_paterno,
          apellido_materno,
          fecha_nacimiento,
          telefono,
          calle,
          num_calle,
          barrio,
          localidad,
          codigo_postal,
          rfc,
          id,
        ]
      );
      return result.affectedRows > 0;
    } catch (err) {
      console.error("Error al actualizar el contribuyente:", err);
      throw new Error("Error al actualizar el contribuyente");
    }
  }
}

module.exports = Contribuyente;

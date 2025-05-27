// filepath: /models/gestionEstablecimientoModel.js
const db = require("../config/database");

class Establecimiento {
  static async getAll() {
    try {
      const [rows] = await db.query(`
        SELECT 
        nombre_establecimiento,
        direccion_establecimiento,
        barrio_establecimiento,
        localidad_establecimiento,
        codigo_postal_establecimiento,
        fecha_apertura_establecimiento,
        giro_negocio_establecimiento,
        nombre_completo
        FROM establecimientos, contribuyentes 
        WHERE establecimientos.id_contribuyente = contribuyentes.id_contribuyente
`);
      return rows;
    } catch (err) {
      console.error("Error en la consulta:", err);
      throw new Error("Error al obtener establecimientos");
    }
  }

  static async getById(id) {
    try {
      const [rows] = await db.query(
        "SELECT * FROM establecimientos WHERE id = ?",
        [id]
      );
      return rows[0];
    } catch (err) {
      console.error("Error en la consulta:", err);
      throw new Error("Error al obtener el establecimiento");
    }
  }
}

module.exports = Establecimiento;

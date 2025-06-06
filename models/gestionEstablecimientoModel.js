// filepath: /models/gestionEstablecimientoModel.js
const db = require("../config/database");

class Establecimiento {
  static async getAll() {
    try {
      const [rows] = await db.query(`
     SELECT  
        e.nombre_establecimiento,
        e.direccion,
        e.barrio,
        e.localidad,
        e.codigo_postal,
        e.fecha_apertura,
        e.giro_negocio,
        c.nombre_completo AS nombre_contribuyente
        FROM establecimientos AS e
        JOIN contribuyentes AS c ON e.id_contribuyente = c.id_contribuyente;


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

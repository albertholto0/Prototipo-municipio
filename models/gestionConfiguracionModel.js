// filepath: /models/configuracionSistemaModel.js
const db = require("../config/database");

class ConfiguracionSistema {
  static async getAll() {
    try {
      const [rows] = await db.query(`
        SELECT  
          id_configuracion,
          dependencia,
          lema,
          rfc,
          id_cif
        FROM configuraciones_sistema
      `);
      return rows;
    } catch (err) {
      console.error("Error en la consulta:", err);
      throw new Error("Error al obtener configuraciones del sistema");
    }
  }

  static async getById(id) {
    try {
      const [rows] = await db.query(
        "SELECT * FROM configuraciones_sistema WHERE id_configuracion = ?",
        [id]
      );
      return rows[0];
    } catch (err) {
      console.error("Error en la consulta:", err);
      throw new Error("Error al obtener la configuración");
    }
  }
}

module.exports = ConfiguracionSistema;

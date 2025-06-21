const db = require("../config/database");

class Establecimiento {
  static async getAll() {
    try {
      const [rows] = await db.query(`
        SELECT  
          e.id_establecimiento,
          e.nombre_establecimiento,
          e.direccion,
          e.barrio,
          e.localidad,
          e.codigo_postal,
          e.fecha_apertura,
          e.giro_negocio,
          c.nombre_completo AS nombre_contribuyente
        FROM establecimientos AS e
        JOIN contribuyente AS c ON e.id_contribuyente = c.id_contribuyente;
      `);
      return rows;
    } catch (err) {
      console.error("Error en la consulta:", err);
      throw new Error("Error al obtener establecimientos");
    }
  }

  static async create(data) {
    try {
      console.log("Valores recibidos para insertar:", data);
      const sql = `
        INSERT INTO establecimientos 
        (nombre_establecimiento, direccion, barrio, localidad, codigo_postal, fecha_apertura, giro_negocio, id_contribuyente)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

      const values = [
        data.nombre_establecimiento,
        data.direccion,
        data.barrio,
        data.localidad,
        data.codigo_postal,
        data.fecha_apertura,
        data.giro_negocio,
        data.id_contribuyente,
      ];

      const [result] = await db.query(sql, values);
      return result;
    } catch (err) {
      console.error("Error al insertar establecimiento:", err.message);
      console.error("Detalles completos:", err);
      throw new Error("No se pudo crear el establecimiento: ${err.message}");
    }
  }
}

module.exports = Establecimiento;

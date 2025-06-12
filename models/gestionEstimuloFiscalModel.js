const db = require("../config/database");

class EstimuloFiscal {
  static async getAll() {
    try {
      const [rows] = await db.query(`
        SELECT  
          id_estimulo_fiscal,       
          nombre_contribucion,       
          porcentaje_descuento,
          caracteristicas,
          requisitos,
          resumen_caracteristicas,   
          tipo_descuento            
        FROM estimulos_fiscales
      `);
      return rows;
    } catch (err) {
      console.error("Error en la consulta:", err);
      throw new Error("Error al obtener estímulos fiscales");  
    }
  }
}

module.exports = EstimuloFiscal;
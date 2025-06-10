// filepath: /models/gestionEstimuloFiscalController.js
const db = require("../config/database");

class EstimuloFiscal {
  static async getAll() {
    try {
      const [rows] = await db.query(`
     SELECT  
        nombre_contribucion,
        porcentaje_descuento,
        caracteristicas,
        requisitos,
        FROM estimulos_fiscales;
`);
      return rows;
    } catch (err) {
      console.error("Error en la consulta:", err);
      throw new Error("Error al obtener establecimientos");
    }
  }
}

module.exports = EstimuloFiscal;

const db = require("../config/database");

class EstimuloFiscal {
  static async getAll() {
    try {
      const [rows] = await db.query(`
        SELECT  
          id_estimulo_fiscal,       
          nombre_contribucion,       
          caracteristicas,
          porcentaje_descuento,
          requisitos,
          resumen_caracteristicas,   
          tipo_descuento            
        FROM estimulos_fiscales
      `);
      return rows;
    } catch (error) {
      console.error("Error al obtener todos los estímulos fiscales:", error);
      throw error;
    }
    }

  static async getById(id) {
      try {
        const [rows] = await db.query(`
          SELECT  
            id_estimulo_fiscal,       
            nombre_contribucion,       
            caracteristicas,
            porcentaje_descuento,
            requisitos,
            resumen_caracteristicas,   
            tipo_descuento            
          FROM estimulos_fiscales
          WHERE id_estimulo_fiscal = ?
        `, [id]);
        return rows[0];
      } catch (error) {
        console.error("Error al obtener el estímulo fiscal por ID:", error);
        throw error;
      }
    }
  static async create(data) {
  try {
    const {
      nombre_contribucion,
      caracteristicas,
      porcentaje_descuento,
      requisitos,
      tipo_descuento // <-- nuevo campo
    } = data;
    const resumen_caracteristicas = '';
    const [result] = await db.query(`
      INSERT INTO estimulos_fiscales 
        (nombre_contribucion, caracteristicas, porcentaje_descuento, requisitos, resumen_caracteristicas, tipo_descuento)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [nombre_contribucion, caracteristicas, porcentaje_descuento, requisitos, resumen_caracteristicas, tipo_descuento]);
    return { id: result.insertId, ...data };
  } catch (error) {
    console.error("Error al crear el estímulo fiscal:", error);
    throw error;
  };
}

static async update(id, data) {
  try {
    const {
      nombre_contribucion,
      caracteristicas,
      porcentaje_descuento,
      requisitos,
      tipo_descuento // <-- nuevo campo
    } = data;
    const resumen_caracteristicas = '';
    await db.query(`
      UPDATE estimulos_fiscales SET
        nombre_contribucion = ?, 
        caracteristicas = ?, 
        porcentaje_descuento = ?, 
        requisitos = ?, 
        resumen_caracteristicas = ?, 
        tipo_descuento = ?
      WHERE id_estimulo_fiscal = ?
    `, [nombre_contribucion, caracteristicas, porcentaje_descuento, requisitos, resumen_caracteristicas, tipo_descuento, id]);
    return { id, ...data };
  } catch (error) {
    console.error("Error al actualizar el estímulo fiscal:", error);
    throw error;
  }
}
  static async delete(id) {
    try {
      await db.query(`
        DELETE FROM estimulos_fiscales WHERE id_estimulo_fiscal = ?
      `, [id]);
    } catch (error) {
      console.error("Error al eliminar el estímulo fiscal:", error);
      throw error;
    }
  }
}
module.exports = EstimuloFiscal;
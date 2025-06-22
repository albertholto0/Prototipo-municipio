const db = require('../config/database');

class BaseCatastral {
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM bases_catastrales');
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query(
      'SELECT * FROM bases_catastrales WHERE id_base_catastral = ?',
      [id]
    );
    return rows[0];
  }

  static async create(data) {
    const { cuenta, base_catastral, id_contribuyente, ubicacion, barrio,
            impuesto_calculado, fecha_avaluo, historial_avaluos } = data;
    const [result] = await db.query(
      `INSERT INTO bases_catastrales 
        (cuenta, base_catastral, id_contribuyente, ubicacion, barrio,
         impuesto_calculado, fecha_avaluo, historial_avaluos)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [cuenta, base_catastral, id_contribuyente, ubicacion, barrio,
       impuesto_calculado, fecha_avaluo, historial_avaluos]
    );
    return { id: result.insertId, ...data };
  }

  static async update(id, data) {
    const { cuenta, base_catastral, id_contribuyente, ubicacion, barrio,
            impuesto_calculado, fecha_avaluo, historial_avaluos } = data;
    await db.query(
      `UPDATE bases_catastrales SET
         cuenta = ?, base_catastral = ?, id_contribuyente = ?, ubicacion = ?, barrio = ?,
         impuesto_calculado = ?, fecha_avaluo = ?, historial_avaluos = ?
       WHERE id_base_catastral = ?`,
      [cuenta, base_catastral, id_contribuyente, ubicacion, barrio,
       impuesto_calculado, fecha_avaluo, historial_avaluos, id]
    );
    return { id, ...data };
  }

  static async delete(id) {
    await db.query(
      'DELETE FROM bases_catastrales WHERE id_base_catastral = ?',
      [id]
    );
  }
}

module.exports = BaseCatastral;

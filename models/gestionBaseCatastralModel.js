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
            valor_terreno, valor_construccion, impuesto_calculado, uso_suelo } = data;
    const [result] = await db.query(
      `INSERT INTO bases_catastrales 
        (cuenta, base_catastral, id_contribuyente, ubicacion, barrio,
         valor_terreno, valor_construccion, impuesto_calculado, uso_suelo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [cuenta, base_catastral, id_contribuyente, ubicacion, barrio,
       valor_terreno, valor_construccion, impuesto_calculado, uso_suelo]
    );
    return { id: result.insertId, ...data };
  }

  static async update(id, data) {
    const { cuenta, base_catastral, id_contribuyente, ubicacion, barrio,
            valor_terreno, valor_construccion, impuesto_calculado, uso_suelo } = data;
    await db.query(
      `UPDATE bases_catastrales SET
         cuenta = ?, base_catastral = ?, id_contribuyente = ?, ubicacion = ?, barrio = ?,
         valor_terreno = ?, valor_construccion = ?, impuesto_calculado = ?, uso_suelo = ?
       WHERE id_base_catastral = ?`,
      [cuenta, base_catastral, id_contribuyente, ubicacion, barrio,
       valor_terreno, valor_construccion, impuesto_calculado, uso_suelo, id]
    );
    return { id, ...data };
  }

  static async delete(id) {
    await db.query(
      'DELETE FROM bases_catastrales WHERE id_base_catastral = ?',
      [id]
    );
    return;
  }
}

module.exports = BaseCatastral;

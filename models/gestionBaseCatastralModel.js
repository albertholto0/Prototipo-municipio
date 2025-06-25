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

    try {
      // Validar si la cuenta ya existe
      const [rows] = await db.query(
        'SELECT 1 FROM bases_catastrales WHERE cuenta = ? LIMIT 1',
        [cuenta]
      );

      if (rows.length > 0) {
        const error = new Error('Cuenta duplicada');
        error.code = 'DUPLICATE_ACCOUNT';
        throw error;
      }

      const [result] = await db.query(
        `INSERT INTO bases_catastrales 
        (cuenta, base_catastral, id_contribuyente, ubicacion, barrio,
         impuesto_calculado, fecha_avaluo, historial_avaluos)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [cuenta, base_catastral, id_contribuyente, ubicacion, barrio,
          impuesto_calculado, fecha_avaluo, historial_avaluos]
      );

      return { id: result.insertId, ...data };

    } catch (err) {
      // Captura error de la base de datos (por seguridad extra)
      if (err.code === 'ER_DUP_ENTRY') {
        const dupErr = new Error('Cuenta ya existe en la base de datos');
        dupErr.code = 'DUPLICATE_ACCOUNT';
        throw dupErr;
      }
      throw err;
    }
  }

  static async update(id, data) {
  const { cuenta, base_catastral, id_contribuyente, ubicacion, barrio,
    impuesto_calculado, fecha_avaluo, historial_avaluos } = data;

  try {
    const [result] = await db.query(
      `UPDATE bases_catastrales SET 
        cuenta = ?, 
        base_catastral = ?, 
        id_contribuyente = ?, 
        ubicacion = ?, 
        barrio = ?, 
        impuesto_calculado = ?, 
        fecha_avaluo = ?, 
        historial_avaluos = ?
      WHERE id_base_catastral = ?`,
      [cuenta, base_catastral, id_contribuyente, ubicacion, barrio,
        impuesto_calculado, fecha_avaluo, historial_avaluos, id]
    );

    return { id_base_catastral: id, ...data };
  } catch (err) {
    console.error('Error al actualizar base catastral:', err);
    throw err;
  }
}

  static async delete(id) {
    await db.query(
      'DELETE FROM bases_catastrales WHERE id_base_catastral = ?',
      [id]
    );
  }
}

module.exports = BaseCatastral;

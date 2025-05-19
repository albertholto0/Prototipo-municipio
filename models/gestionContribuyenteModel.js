const e = require('express');
const db = require('../config/database');

class Contribuyente {
  static async getAll() {
    const [rows] = await db.query(`
    SELECT 
      nombre_completo,
      rfc,
      calle,
      numero_vivienda,
      barrio,
      fecha_nacimiento,
      tipo_contribuyente
    FROM contribuyentes
  `);

    constc[rows] = db.query(query, (err, results) => {
      if (err) {
        console.error('Error en la consulta:', err);
        return res.status(500).json({
          error: 'Error al obtener contribuyentes',
          detalles: err.message
        });
      }
      res.json(results);
    });
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM contribuyentes WHERE id = ?', [id]);
    return rows[0];
  }

  // Agregar más métodos según necesites (create, update, delete, etc.)
}

module.exports = Contribuyente;
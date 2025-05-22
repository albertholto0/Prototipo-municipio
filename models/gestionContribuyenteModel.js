// filepath: /home/rafaeldiaz/Documentos/Sexto Semestre/Ingenieria de Software II/Prototipo-municipio/models/gestionContribuyenteModel.js
const db = require('../config/database');

class Contribuyente {
  static async getAll() {
    try {
      const [rows] = await db.query(`
        SELECT 
          nombre_completo,
          rfc,
          direccion,
          barrio,
          localidad,
          fecha_nacimiento,
          tipo_contribuyente
        FROM contribuyentes
      `);
      return rows;
    } catch (err) {
      console.error('Error en la consulta:', err);
      throw new Error('Error al obtener contribuyentes');
    }
  }

  static async getById(id) {
    try {
      const [rows] = await db.query('SELECT * FROM contribuyentes WHERE id = ?', [id]);
      return rows[0];
    } catch (err) {
      console.error('Error en la consulta:', err);
      throw new Error('Error al obtener el contribuyente');
    }
  }
}

module.exports = Contribuyente;
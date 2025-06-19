// filepath: /home/rafaeldiaz/Documentos/Sexto Semestre/Ingenieria de Software II/Prototipo-municipio/models/gestionContribuyenteModel.js
const db = require('../config/database');

class Contribuyente {
  static async getAll() {
    try {
      const [rows] = await db.query(`
        SELECT
          id_contribuyente,
          nombre_completo,
          rfc,
          direccion,
          barrio,
          localidad,
          telefono
        FROM contribuyente
      `);
      return rows;
    } catch (err) {
      console.error('Error en la consulta:', err);
      throw new Error('Error al obtener contribuyentes');
    }
  }

  static async deleteContribuyente(id) {
    try {
      const [rows] = await db.query('DELETE FROM contribuyente WHERE id = ?', [id]);
      return rows[0];
    } catch (err) {
      console.error('Error en la consulta:', err);
      throw new Error('Error al eliminar el contribuyente');
    }
  }

  static async setContribuyente(nombre_completo,fecha_nacimiento, telefono, direccion, barrio, localidad, codigo_postal, rfc) {
        try {
            const [result] = await db.query(
                'INSERT INTO contribuyente (nombre_completo, fecha_nacimiento, telefono, direccion, barrio, localidad, codigo_postal, rfc, copia_credencial) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [nombre_completo,fecha_nacimiento, telefono, direccion, barrio, localidad, codigo_postal, rfc, "/home/imagenes/contribuyentes_ine"]
            );
            return result.insertId;
        } catch (err) {
            console.error('Error al crear usuario:', err);
        }
    }
}

module.exports = Contribuyente;
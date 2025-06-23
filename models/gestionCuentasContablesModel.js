const db = require('../config/database');

class CuentasContables {
  static async getAll() {
    try {
      const [rows] = await db.query(
        'SELECT clave_cuenta AS id_cuentaContable, nombre_cuentaContable, estado FROM cuentas_contables'
      );
      return rows;
    } catch (err) {
      console.error('Error en la consulta:', err);
      throw new Error('Error al obtener cuentas contables');
    }
  }

  static async create(cuenta) {
    try {
      const { nombre_cuentaContable, estado = true } = cuenta;
      const [result] = await db.query(
        `INSERT INTO cuentas_contables (nombre_cuentaContable, estado)
         VALUES (?, ?)`,
        [nombre_cuentaContable, estado]
      );
      return {
        id_cuentaContable: result.insertId,
        nombre_cuentaContable,
        estado,
      };
    } catch (err) {
      console.error('Error al crear cuenta contable:', err);
      throw new Error('Error al crear cuenta contable');
    }
  }

  static async update(id, cuenta) {
    try {
      const { nombre_cuentaContable, estado } = cuenta;
      await db.query(
        `UPDATE cuentas_contables
         SET nombre_cuentaContable = ?, estado = ?
         WHERE clave_cuenta = ?`,
        [nombre_cuentaContable, estado, id]
      );
      return { id_cuentaContable: id, ...cuenta };
    } catch (err) {
      console.error('Error al actualizar cuenta contable:', err);
      throw new Error('Error al actualizar cuenta contable');
    }
  }

  static async delete(id) {
    try {
      await db.query('DELETE FROM cuentas_contables WHERE clave_cuenta = ?', [id]);
      return { id_cuentaContable: id };
    } catch (err) {
      console.error('Error al eliminar cuenta contable:', err);
      throw new Error('Error al eliminar cuenta contable');
    }
  }
}

module.exports = CuentasContables;

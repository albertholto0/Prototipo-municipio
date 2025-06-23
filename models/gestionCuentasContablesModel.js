// models/gestionCuentasContablesModel.js

const db = require('../config/database');

class CuentasContables {
  static async getAll() {
    try {
      const [rows] = await db.query(
        'SELECT id_cuentaContable, clave_cuentaContable, nombre_cuentaContable, estado FROM cuentas_contables'
      );
      return rows;
    } catch (err) {
      console.error('Error en la consulta:', err);
      throw new Error('Error al obtener cuentas contables');
    }
  }

  static async create(cuenta) {
    try {
      // Aquí extraemos correctamente clave_cuentaContable
      const { clave_cuentaContable, nombre_cuentaContable, estado = true } = cuenta;
      const [result] = await db.query(
        `INSERT INTO cuentas_contables (clave_cuentaContable, nombre_cuentaContable, estado)
         VALUES (?, ?, ?)`,
        [clave_cuentaContable, nombre_cuentaContable, estado]
      );
      return {
        id_cuentaContable: result.insertId,
        clave_cuentaContable,
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
      const { clave_cuentaContable, nombre_cuentaContable, estado } = cuenta;
      await db.query(
        `UPDATE cuentas_contables
         SET clave_cuentaContable = ?, nombre_cuentaContable = ?, estado = ?
         WHERE id_cuentaContable = ?`,
        [clave_cuentaContable, nombre_cuentaContable, estado, id]
      );
      return {
        id_cuentaContable: Number(id),
        clave_cuentaContable,
        nombre_cuentaContable,
        estado
      };
    } catch (err) {
      console.error('Error al actualizar cuenta contable:', err);
      throw new Error('Error al actualizar cuenta contable');
    }
  }

  static async delete(id) {
    try {
      await db.query(
        'DELETE FROM cuentas_contables WHERE id_cuentaContable = ?',
        [id]
      );
      return { id_cuentaContable: Number(id) };
    } catch (err) {
      console.error('Error al eliminar cuenta contable:', err);
      throw new Error('Error al eliminar cuenta contable');
    }
  }
}

module.exports = CuentasContables;

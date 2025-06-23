// models/gestionCuentasContablesModel.js

const db = require('../config/database');

class CuentasContables {
  /** Devuelve todas las cuentas con los nombres de campo que el front espera */
  static async getAll() {
    try {
      const [rows] = await db.query(
        `SELECT
           clave_cuenta        AS clave_cuenta_contable,
           nombre_cuentaContable,
           estado
         FROM cuentas_contables`
      );
      return rows;
    } catch (err) {
      console.error('Error en la consulta getAll:', err);
      throw new Error('Error al obtener cuentas contables');
    }
  }

  /** Crea una cuenta; devuelve el objeto con clave_cuenta_contable = insertId */
  static async create(cuenta) {
    try {
      const { nombre_cuentaContable, estado = true } = cuenta;
      const [result] = await db.query(
        `INSERT INTO cuentas_contables (nombre_cuentaContable, estado)
         VALUES (?, ?)`,
        [nombre_cuentaContable, estado]
      );
      return {
        clave_cuenta_contable: result.insertId,
        nombre_cuentaContable,
        estado,
      };
    } catch (err) {
      console.error('Error al crear cuenta contable:', err);
      throw new Error('Error al crear cuenta contable');
    }
  }

  /** Actualiza una cuenta existente; recibe id = clave_cuenta */
  static async update(id, cuenta) {
    try {
      const { nombre_cuentaContable, estado } = cuenta;
      await db.query(
        `UPDATE cuentas_contables
         SET nombre_cuentaContable = ?, estado = ?
         WHERE clave_cuenta = ?`,
        [nombre_cuentaContable, estado, id]
      );
      return {
        clave_cuenta_contable: id,
        nombre_cuentaContable,
        estado,
      };
    } catch (err) {
      console.error('Error al actualizar cuenta contable:', err);
      throw new Error('Error al actualizar cuenta contable');
    }
  }

  /** Elimina la cuenta cuyo clave_cuenta = id */
  static async delete(id) {
    try {
      await db.query(
        `DELETE FROM cuentas_contables WHERE clave_cuenta = ?`,
        [id]
      );
      return { clave_cuenta_contable: id };
    } catch (err) {
      console.error('Error al eliminar cuenta contable:', err);
      throw new Error('Error al eliminar cuenta contable');
    }
  }
}

module.exports = CuentasContables;

// models/gestionSubcuentasContablesModel.js

const db = require('../config/database');

class SubcuentasContables {
  /**
   * Obtiene todas las subcuentas contables,
   * junto con la clave de su cuenta principal.
   */
  static async getAll() {
    try {
      const [rows] = await db.query(`
        SELECT 
          sc.clave_subcuenta, 
          cc.clave_cuentaContable, 
          sc.nombre, 
          sc.estado 
        FROM subcuentas_contables AS sc
        JOIN cuentas_contables AS cc
          ON sc.id_cuentaContable = cc.id_cuentaContable
      `);
      return rows;
    } catch (err) {
      console.error('Error en getAll():', err);
      throw new Error('Error al obtener subcuentas contables');
    }
  }

  /**
   * Crea una nueva subcuenta contable y la marca como activa (estado = 1).
   * Captura errores de duplicado y de FK para devolver código específico.
   */
  static async setSucuenta(id_cuentaContable, clave_subcuenta, nombre) {
    try {
      const [result] = await db.query(
        `INSERT INTO subcuentas_contables 
           (id_cuentaContable, clave_subcuenta, nombre, estado)
         VALUES (?, ?, ?, 1)`,
        [id_cuentaContable, clave_subcuenta, nombre]
      );
      return result.insertId;
    } catch (err) {
      console.error('Error en setSucuenta():', err);
      // clave_subcuenta duplicada
      if (err.code === 'ER_DUP_ENTRY') {
        const e = new Error('Ya existe una subcuenta con esa clave');
        e.code = 'DUPLICATE_SUBCUENTA';
        throw e;
      }
      // FK falla: id_cuentaContable no existe
      if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_NO_REFERENCED_ROW') {
        const e = new Error('La cuenta principal indicada no existe');
        e.code = 'FK_CONSTRAINT';
        throw e;
      }
      throw err;
    }
  }

  /**
   * Obtiene una sola subcuenta por su clave.
   */
  static async getSubcuentaById(clave_subcuenta) {
    try {
      const [rows] = await db.query(`
        SELECT 
          sc.clave_subcuenta, 
          cc.clave_cuentaContable, 
          sc.nombre, 
          sc.estado,
          sc.id_cuentaContable
        FROM subcuentas_contables AS sc
        JOIN cuentas_contables AS cc
          ON sc.id_cuentaContable = cc.id_cuentaContable
        WHERE sc.clave_subcuenta = ?
      `, [clave_subcuenta]);

      if (rows.length === 0) {
        throw new Error('Subcuenta no encontrada');
      }
      return rows[0];
    } catch (err) {
      console.error('Error en getSubcuentaById():', err);
      throw new Error('Error al obtener la subcuenta');
    }
  }

  /**
   * Actualiza la cuenta principal y el nombre de una subcuenta existente.
   * No modifica el campo estado.
   */
  static async putSubcuenta(clave_subcuenta, id_cuentaContable, nombre) {
    try {
      await db.query(
        `UPDATE subcuentas_contables
         SET id_cuentaContable = ?, nombre = ?
         WHERE clave_subcuenta = ?`,
        [id_cuentaContable, nombre, clave_subcuenta]
      );
    } catch (err) {
      console.error('Error en putSubcuenta():', err);
      throw new Error('Error al actualizar la subcuenta');
    }
  }

  /**
   * Alterna el estado activo (1) / inactivo (0) de la subcuenta.
   * Devuelve el nuevo valor de estado.
   */
  static async toggleEstado(clave_subcuenta) {
    try {
      // 1) Leer estado actual
      const [rows] = await db.query(
        'SELECT estado FROM subcuentas_contables WHERE clave_subcuenta = ?',
        [clave_subcuenta]
      );
      if (rows.length === 0) {
        throw new Error('Subcuenta no encontrada');
      }

      // 2) Invertir el valor
      const nuevo = rows[0].estado === 1 ? 0 : 1;

      // 3) Guardar el nuevo estado
      await db.query(
        'UPDATE subcuentas_contables SET estado = ? WHERE clave_subcuenta = ?',
        [nuevo, clave_subcuenta]
      );

      // 4) Devolver el nuevo estado
      return nuevo;
    } catch (err) {
      console.error('Error en toggleEstado():', err);
      throw err;
    }
  }
}

module.exports = SubcuentasContables;

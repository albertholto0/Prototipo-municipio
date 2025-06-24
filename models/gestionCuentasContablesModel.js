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
      const { clave_cuentaContable, nombre_cuentaContable, estado = 1 } = cuenta;
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
    const { clave_cuentaContable, nombre_cuentaContable } = cuenta;
    let { estado } = cuenta;
    if (estado === undefined) {
      const [rows] = await db.query(
        'SELECT estado FROM cuentas_contables WHERE id_cuentaContable = ?',
        [id]
      );
      if (rows.length === 0) {
        throw new Error('Cuenta no encontrada');
      }
      estado = rows[0].estado;
    }

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
      estado,
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

  static async toggleEstado(id) {
    try {
      // 1) Obtiene el estado actual
      const [rows] = await db.query(
        'SELECT estado FROM cuentas_contables WHERE id_cuentaContable = ?',
        [id]
      );
      if (rows.length === 0) {
        throw new Error('Cuenta contable no encontrada');
      }

      // 2) Invierte el valor (1->0, 0->1)
      const nuevo = rows[0].estado === 1 ? 0 : 1;

      // 3) Actualiza la tabla
      await db.query(
        'UPDATE cuentas_contables SET estado = ? WHERE id_cuentaContable = ?',
        [nuevo, id]
      );

      // 4) Devuelve el nuevo estado
      return nuevo;
    } catch (err) {
      console.error('Error al togglear estado de cuenta contable:', err);
      throw err;
    }
  }
}

module.exports = CuentasContables;

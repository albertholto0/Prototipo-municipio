const db = require('../config/database');

class Recibo {
  // Obtener todos los recibos con JOINs corregidos
  static async getAll() {
    try {
      const query = `
        SELECT
          r.id_recibo,
          r.folio,
          r.fecha_recibo,
          c.nombre AS contribuyente,
          r.ejercicio_fiscal,
          r.ejercicio_periodo,
          co.descripcion AS concepto,
          r.descripcion,
          r.monto_total,
          r.forma_de_pago
        FROM recibos r
        LEFT JOIN contribuyente c ON r.id_contribuyente = c.id_contribuyente
        LEFT JOIN conceptos co ON r.id_concepto = co.clave_concepto
        ORDER BY r.fecha_recibo DESC
      `;
      const [rows] = await db.query(query);
      console.log('Recibos obtenidos:', rows); // Log para depuración
      return rows;
    } catch (err) {
      console.error('Error en getAll:', err);
      throw new Error('Error al obtener recibos');
    }
  }

  // Obtener recibo por ID
  static async getById(id) {
    try {
      const query = `
        SELECT
          r.id_recibo,
          r.folio,
          r.fecha_recibo,
          r.id_contribuyente,
          c.nombre AS contribuyente,
          r.ejercicio_fiscal,
          r.ejercicio_periodo,
          r.id_concepto,
          co.descripcion AS concepto,
          r.descripcion,
          r.monto_total,
          r.forma_de_pago,
          r.detalles
        FROM recibos r
        LEFT JOIN contribuyente c ON r.id_contribuyente = c.id_contribuyente
        LEFT JOIN conceptos co ON r.id_concepto = co.clave_concepto
        WHERE r.id_recibo = ?
      `;
      const [rows] = await db.query(query, [id]);
      return rows[0];
    } catch (err) {
      console.error('Error en getById:', err);
      throw new Error('Error al obtener recibo por ID');
    }
  }

  // Crear nuevo recibo
  static async create(reciboData) {
    try {
      const dataToInsert = {
        folio: reciboData.folio,
        fecha_recibo: reciboData.fecha,
        id_contribuyente: reciboData.contribuyente_id,
        ejercicio_fiscal: reciboData.ejercicio_id,
        ejercicio_periodo: reciboData.periodo,
        id_concepto: reciboData.concepto,
        monto_total: reciboData.total,
        forma_de_pago: reciboData.forma_pago,
        descripcion: reciboData.detalles || null
      };

      console.log('Datos a insertar:', dataToInsert); // Log para depuración
      
      const [result] = await db.query('INSERT INTO recibos SET ?', dataToInsert);
      return this.getById(result.insertId);
    } catch (err) {
      console.error('Error en create:', err);
      throw err; // Re-lanzamos el error para manejo específico en el controller
    }
  }

  // Actualizar un recibo
  static async update(id, reciboData) {
    try {
      const dataToUpdate = {
        folio: reciboData.folio,
        fecha_recibo: reciboData.fecha,
        id_contribuyente: reciboData.contribuyente_id,
        ejercicio_fiscal: reciboData.ejercicio_id,
        ejercicio_periodo: reciboData.periodo,
        id_concepto: reciboData.concepto,
        monto_total: reciboData.total,
        forma_de_pago: reciboData.forma_pago,
        descripcion: reciboData.detalles || null
      };

      await db.query('UPDATE recibos SET ? WHERE id_recibo = ?', [dataToUpdate, id]);
      return this.getById(id);
    } catch (err) {
      console.error('Error en update:', err);
      throw new Error('Error al actualizar recibo');
    }
  }

  // Eliminar un recibo
  static async delete(id) {
    try {
      const [result] = await db.query('DELETE FROM recibos WHERE id_recibo = ?', [id]);
      return result.affectedRows > 0;
    } catch (err) {
      console.error('Error en delete:', err);
      throw new Error('Error al eliminar recibo');
    }
  }

  // Obtener recibos filtrados
  static async getByFilters(filters) {
    try {
      let query = `
        SELECT
          r.id_recibo,
          r.folio,
          r.fecha_recibo,
          c.nombre AS contribuyente,
          r.ejercicio_fiscal,
          r.ejercicio_periodo,
          co.descripcion AS concepto,
          r.descripcion,
          r.monto_total,
          r.forma_de_pago
        FROM recibos r
        LEFT JOIN contribuyente c ON r.id_contribuyente = c.id_contribuyente
        LEFT JOIN conceptos co ON r.id_concepto = co.clave_concepto
        WHERE 1=1
      `;
      const params = [];

      if (filters.folio) {
        query += ' AND r.folio LIKE ?';
        params.push(`%${filters.folio}%`);
      }

      if (filters.nombreContribuyente) {
        query += ' AND c.nombre LIKE ?';
        params.push(`%${filters.nombreContribuyente}%`);
      }

      if (filters.fechaInicio) {
        query += ' AND r.fecha_recibo >= ?';
        params.push(filters.fechaInicio);
      }

      if (filters.fechaFin) {
        query += ' AND r.fecha_recibo <= ?';
        params.push(filters.fechaFin);
      }

      query += ' ORDER BY r.fecha_recibo DESC';

      console.log('Query con filtros:', query); // Log para depuración
      console.log('Parámetros:', params); // Log para depuración

      const [rows] = await db.query(query, params);
      return rows;
    } catch (err) {
      console.error('Error en getByFilters:', err);
      throw new Error('Error al filtrar recibos');
    }
  }
}

module.exports = Recibo;

const Recibo = require('../models/gestionReciboModel');

const getAllRecibos = async (req, res) => {
  try {
    console.log('Obteniendo todos los recibos...');
    const recibos = await Recibo.getAll();
    console.log(`Se obtuvieron ${recibos.length} recibos`);
    res.json(recibos);
  } catch (error) {
    console.error('Error al obtener los recibos:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};

const createRecibo = async (req, res) => {
  try {
    const {
      folio,
      fecha,
      contribuyente_id,
      ejercicio_id,
      periodo,
      concepto,
      total,
      forma_pago,
      detalles
    } = req.body;

    // Validación de campos obligatorios
    if (!folio || !fecha || !contribuyente_id || !ejercicio_id || !periodo || !concepto || !total || !forma_pago) {
      return res.status(400).json({ 
        error: 'Faltan campos obligatorios',
        campos_requeridos: ['folio', 'fecha', 'contribuyente_id', 'ejercicio_id', 'periodo', 'concepto', 'total', 'forma_pago']
      });
    }

    const nuevo = await Recibo.create({
      folio,
      fecha,
      contribuyente_id,
      ejercicio_id,
      periodo,
      concepto,
      total,
      forma_pago,
      detalles
    });

    res.status(201).json({ 
      success: true, 
      message: 'Recibo registrado exitosamente', 
      recibo: nuevo 
    });
  } catch (error) {
    console.error('Error al registrar recibo:', error);
    
    // Manejar errores específicos
    if (error.message.includes('Duplicate entry')) {
      return res.status(409).json({ 
        error: 'El folio ya existe',
        details: 'Ya existe un recibo con ese folio'
      });
    }
    
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};

const updateRecibo = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      folio,
      fecha,
      contribuyente_id,
      ejercicio_id,
      periodo,
      concepto,
      total,
      forma_pago,
      detalles
    } = req.body;

    // Verificar que el recibo existe
    const reciboExistente = await Recibo.getById(id);
    if (!reciboExistente) {
      return res.status(404).json({ error: 'Recibo no encontrado' });
    }

    const actualizado = await Recibo.update(id, {
      folio,
      fecha,
      contribuyente_id,
      ejercicio_id,
      periodo,
      concepto,
      total,
      forma_pago,
      detalles
    });

    res.json({ 
      success: true, 
      message: 'Recibo actualizado exitosamente', 
      recibo: actualizado 
    });
  } catch (error) {
    console.error('Error al actualizar recibo:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};

const deleteRecibo = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que el recibo existe
    const reciboExistente = await Recibo.getById(id);
    if (!reciboExistente) {
      return res.status(404).json({ error: 'Recibo no encontrado' });
    }

    const eliminado = await Recibo.delete(id);
    
    if (eliminado) {
      res.json({ success: true, message: 'Recibo eliminado exitosamente' });
    } else {
      res.status(400).json({ error: 'No se pudo eliminar el recibo' });
    }
  } catch (error) {
    console.error('Error al eliminar recibo:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const recibo = await Recibo.getById(id);

    if (!recibo) {
      return res.status(404).json({ error: 'Recibo no encontrado' });
    }

    res.json(recibo);
  } catch (error) {
    console.error('Error al obtener recibo por ID:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};

const getByFilters = async (req, res) => {
  try {
    const { folio, nombreContribuyente, fechaInicio, fechaFin } = req.query;

    console.log('Filtros recibidos:', { folio, nombreContribuyente, fechaInicio, fechaFin });

    const recibos = await Recibo.getByFilters({
      folio,
      nombreContribuyente,
      fechaInicio,
      fechaFin
    });

    console.log(`Se encontraron ${recibos.length} recibos con los filtros aplicados`);
    res.json(recibos);
  } catch (error) {
    console.error('Error al buscar recibos:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
};

// Función adicional para verificar el estado de la conexión
const healthCheck = async (req, res) => {
  try {
    // Intentar obtener un recibo para verificar la conexión
    await Recibo.getAll();
    res.json({ 
      status: 'OK', 
      message: 'Servicio de recibos funcionando correctamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Error en el servicio de recibos',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  getAllRecibos,
  createRecibo,
  updateRecibo,
  deleteRecibo,
  getById,
  getByFilters,
  healthCheck
};
const EjercicioFiscal = require('../models/gestionEjercicioFiscalModel');

// Obtener todos los ejercicios fiscales
exports.getAllEjercicios = async (req, res) => {
  try {
    const ejercicios = await EjercicioFiscal.getAll();
    res.json(ejercicios);
  } catch (error) {
    console.error('Error al obtener los ejercicios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Registrar nuevo ejercicio fiscal
exports.createEjercicio = async (req, res) => {
  try {
    const {
      anio,
      fecha_inicio,
      fecha_fin,
      estado,
      proyeccion_ingreso,
      ingreso_recaudado,
      observaciones
    } = req.body;

    if (!anio || !fecha_inicio || !fecha_fin || !estado || proyeccion_ingreso == null || ingreso_recaudado == null) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const nuevo = await EjercicioFiscal.create({
      anio,
      fecha_inicio,
      fecha_fin,
      estado,
      proyeccion_ingreso,
      ingreso_recaudado,
      observaciones
    });

    res.status(201).json({ success: true, message: 'Ejercicio fiscal registrado', ejercicio: nuevo });
  } catch (error) {
    console.error('Error al registrar ejercicio fiscal:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar ejercicio fiscal
exports.updateEjercicio = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      anio,
      fecha_inicio,
      fecha_fin,
      estado,
      proyeccion_ingreso,
      ingreso_recaudado,
      observaciones
    } = req.body;

    const actualizado = await EjercicioFiscal.update(id, {
      anio,
      fecha_inicio,
      fecha_fin,
      estado,
      proyeccion_ingreso,
      ingreso_recaudado,
      observaciones
    });

    res.json({ success: true, message: 'Ejercicio fiscal actualizado', ejercicio: actualizado });
  } catch (error) {
    console.error('Error al actualizar ejercicio fiscal:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Eliminar ejercicio fiscal
exports.deleteEjercicio = async (req, res) => {
  try {
    const { id } = req.params;
    await EjercicioFiscal.delete(id);
    res.json({ success: true, message: 'Ejercicio fiscal eliminado' });
  } catch (error) {
    console.error('Error al eliminar ejercicio fiscal:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener ejercicio por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const ejercicio = await EjercicioFiscal.getById(id);

    if (!ejercicio) {
      return res.status(404).json({ error: 'Ejercicio fiscal no encontrado' });
    }

    res.json(ejercicio);
  } catch (error) {
    console.error('Error al obtener ejercicio por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

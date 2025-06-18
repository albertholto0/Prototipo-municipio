const Conceptos = require('../models/Conceptos');

// Controlador para gestionar conceptos
exports.getConceptos = async (req, res) => {
  try {
    const conceptos = await Conceptos.getAll();
    res.json(conceptos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Controlador para registrar un nuevo concepto
exports.createConcepto = async (req, res) => {
  try {
    const { clave_concepto, clave_seccion, descripcion, tipo_servicio, cuota, periodicidad } = req.body;

    if (!clave_concepto || !clave_seccion || !descripcion || !tipo_servicio || !cuota || !periodicidad) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const conceptoId = await Conceptos.create(
      clave_concepto,
      clave_seccion,
      descripcion,
      tipo_servicio,
      cuota,
      periodicidad
    );

    res.status(201).json({
      success: true,
      message: 'Concepto registrado exitosamente',
      conceptoId
    });

  } catch (error) {
    console.error('Error al registrar concepto:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Controlador para actualizar un concepto
exports.updateConcepto = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion, tipo_servicio, cuota, periodicidad } = req.body;

    if (!descripcion || !tipo_servicio || !cuota || !periodicidad) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    await Conceptos.update(
      id,
      descripcion,
      tipo_servicio,
      cuota,
      periodicidad
    );

    res.status(200).json({
      success: true,
      message: 'Concepto actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error al actualizar concepto:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};
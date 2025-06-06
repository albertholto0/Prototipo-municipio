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

exports.createConcepto = async (req, res) => {
  try {
    const { clave_concepto, clave_seccion, nombre_conceptos, descripcion, tipo_servicio } = req.body;

    if (!clave_concepto || !clave_seccion || !nombre_conceptos || !descripcion || !tipo_servicio) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const conceptoId = await Conceptos.create(
      clave_concepto,
      clave_seccion,
      nombre_conceptos,
      descripcion,
      tipo_servicio
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
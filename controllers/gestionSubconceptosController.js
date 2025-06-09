const Subconceptos = require('../models/Subconceptos');
// Controlador para gestionar subconceptos

exports.getSubconceptos = async (req, res) => {
  try {
    const subconceptos = await Subconceptos.getAll();
    res.json(subconceptos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.createSubconcepto = async (req, res) => {
  try {
    const { clave_subconcepto, clave_concepto, nombre_subconceptos, descripcion, tipo_servicio, cuota, periodicidad } = req.body;

    if (!clave_subconcepto || !clave_concepto || !nombre_subconceptos || !descripcion || !tipo_servicio || !cuota || !periodicidad) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const subconceptoId = await Subconceptos.create(
      clave_subconcepto,
      clave_concepto,
      nombre_subconceptos,
      descripcion,
      tipo_servicio,
      cuota,
      periodicidad
    );

    res.status(201).json({
      success: true,
      message: 'Subconcepto registrado exitosamente',
      subconceptoId
    });

  } catch (error) {
    console.error('Error al registrar subconcepto:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};
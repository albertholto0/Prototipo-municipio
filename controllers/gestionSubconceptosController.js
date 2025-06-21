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

exports.getSubconceptoById = async (req, res) => {
  try {
    const { id } = req.params;
    const subconcepto = await Subconceptos.getById(id);
    if (!subconcepto) {
      return res.status(404).json({ message: 'Subconcepto no encontrado' });
    }
    res.json(subconcepto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSubconcepto = async (req, res) => {
  try {
    const {clave_subconcepto_actual} = req.params;
    const { nueva_clave_subconcepto, nueva_clave_concepto, descripcion, tipo_servicio, cuota, periodicidad } = req.body;

    if (!nueva_clave_subconcepto || !nueva_clave_concepto || !descripcion || !tipo_servicio || !cuota || !periodicidad) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const updated = await Subconceptos.update(
      clave_subconcepto_actual,
      nueva_clave_subconcepto,
      nueva_clave_concepto,
      descripcion,
      tipo_servicio,
      cuota,
      periodicidad
    );

    if (!updated) {
      return res.status(404).json({ message: 'Subconcepto no encontrado' });
    }

    res.json({
      success: true,
      message: 'Subconcepto actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error al actualizar subconcepto:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

exports.deleteSubconcepto = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body; // Validar contraseña de administrador

    // Aquí deberías validar la contraseña del administrador
    // if (!validarPasswordAdmin(password)) {
    //   return res.status(401).json({ error: 'Contraseña incorrecta' });
    // }

    const deleted = await Subconceptos.delete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Subconcepto no encontrado' });
    }

    res.json({
      success: true,
      message: 'Subconcepto eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar subconcepto:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};
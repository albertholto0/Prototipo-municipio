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
    const { clave_seccion, descripcion, tipo_servicio, cuota, periodicidad } = req.body;

    if (!clave_seccion || !descripcion || !tipo_servicio || !cuota || !periodicidad) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    await Conceptos.update(
      id,
      clave_seccion,
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
};// ... (otros métodos existentes)

// Controlador para actualizar la clave de concepto
exports.updateConceptoClave = async (req, res) => {
    try {
        const { id } = req.params;
        const { new_clave_concepto, clave_seccion, descripcion, tipo_servicio, cuota, periodicidad } = req.body;

        // Verificar si hay subconceptos asociados
        const tieneSubconceptos = await Conceptos.checkSubconceptos(id);
        if (tieneSubconceptos) {
            return res.status(400).json({ 
                success: false,
                error: 'No se puede modificar la clave concepto porque tiene subconceptos asociados' 
            });
        }

        await Conceptos.updateClaveConcepto(
            id,
            new_clave_concepto,
            clave_seccion,
            descripcion,
            tipo_servicio,
            cuota,
            periodicidad
        );

        res.status(200).json({
            success: true,
            message: 'Clave de concepto actualizada exitosamente'
        });

    } catch (error) {
        console.error('Error al actualizar clave de concepto:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// Controlador para eliminar un concepto
exports.deleteConcepto = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        // Aquí deberías verificar la contraseña de administrador
        // if (!verificarPassword(password)) { ... }

        // Verificar si hay subconceptos asociados
        const tieneSubconceptos = await Conceptos.checkSubconceptos(id);
        if (tieneSubconceptos) {
            return res.status(400).json({ 
                success: false,
                error: 'No se puede eliminar el concepto porque tiene subconceptos asociados' 
            });
        }

        await Conceptos.delete(id);

        res.status(200).json({
            success: true,
            message: 'Concepto eliminado exitosamente'
        });

    } catch (error) {
        console.error('Error al eliminar concepto:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
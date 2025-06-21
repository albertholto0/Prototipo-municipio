// File: controllers/gestionAlquilerController.js
//Sergio Elias Robles Ignacio 
const Alquiler = require('../models/gestionAlquilerModel');

// Obtener todos los alquileres
exports.getAllAlquileres = async (req, res) => {
  try {
    const alquileres = await Alquiler.getAll();
    res.json(alquileres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Registrar un nuevo alquiler
exports.setAlquiler = async (req, res) => {
  try {
    const {
      fecha_inicio,
      fecha_fin,
      numero_viajes,
      kilometros_recorridos,
      horometro_inicio,
      horometro_fin,
      tipo_trabajo,
      concepto,
      tarifa_base,
      monto_total,
      id_recibo
    } = req.body;

    // Validación básica
    if (
      !fecha_inicio || !fecha_fin || !numero_viajes || !kilometros_recorridos ||
      !horometro_inicio || !horometro_fin || !tipo_trabajo || !concepto ||
      !tarifa_base || !monto_total || !id_recibo
    ) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const alquiler = await Alquiler.setAlquiler(
      fecha_inicio,
      fecha_fin,
      numero_viajes,
      kilometros_recorridos,
      horometro_inicio,
      horometro_fin,
      tipo_trabajo,
      concepto,
      tarifa_base,
      monto_total,
      id_recibo
    );

    res.status(201).json({
      success: true,
      message: 'Alquiler registrado exitosamente',
      alquiler
    });

  } catch (error) {
    console.error('Error al registrar alquiler:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Actualizar un alquiler existente
exports.putAlquiler = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fecha_inicio,
      fecha_fin,
      numero_viajes,
      kilometros_recorridos,
      horometro_inicio,
      horometro_fin,
      tipo_trabajo,
      concepto,
      tarifa_base,
      monto_total,
      id_recibo
    } = req.body;

    // Validación básica
    if (
      !fecha_inicio || !fecha_fin || !numero_viajes || !kilometros_recorridos ||
      !horometro_inicio || !horometro_fin || !tipo_trabajo || !concepto ||
      !tarifa_base || !monto_total || !id_recibo
    ) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const alquilerActualizado = await Alquiler.updateAlquiler(
      id,
      fecha_inicio,
      fecha_fin,
      numero_viajes,
      kilometros_recorridos,
      horometro_inicio,
      horometro_fin,
      tipo_trabajo,
      concepto,
      tarifa_base,
      monto_total,
      id_recibo
    );

    res.status(201).json({
      success: true,
      message: 'Alquiler actualizado exitosamente',
      alquilerActualizado
    });

  } catch (error) {
    console.error('Error al actualizar alquiler:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Eliminar un alquiler
exports.deleteAlquiler = async (req, res) => {
  try {
    const { id } = req.params;
    await Alquiler.deleteAlquiler(id);
    res.status(200).json({
      success: true,
      message: 'Alquiler eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar alquiler:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};
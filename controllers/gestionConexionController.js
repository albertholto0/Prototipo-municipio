// File: controllers/gestionConexionController.js
//Sergio Elias Robles Ignacio 
const Conexion = require('../models/gestionConexionModel');

// Obtener todas las conexiones
exports.getAllConexiones = async (req, res) => {
  try {
    const conexiones = await Conexion.getAll();
    res.json(conexiones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Registrar una nueva conexión
exports.setConexion = async (req, res) => {
  try {
    const {
      fecha_conexion,
      id_contribuyente,
      cuenta,
      tipo,
      uso,
      ubicacion,
      barrio
    } = req.body;

    // Validación de campos obligatorios
    if (
      !fecha_conexion ||
      !id_contribuyente ||
      !cuenta ||
      !tipo ||
      !uso ||
      !ubicacion ||
      !barrio
    ) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const conexion = await Conexion.setConexion(
      fecha_conexion,
      id_contribuyente,
      cuenta,
      tipo,
      uso,
      ubicacion,
      barrio
    );

    res.status(201).json({
      success: true,
      message: 'Conexión registrada exitosamente',
      conexion
    });
  } catch (error) {
    console.error('Error al registrar conexión:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Actualizar una conexión existente
exports.putConexion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fecha_conexion,
      id_contribuyente,
      cuenta,
      tipo,
      uso,
      ubicacion,
      barrio
    } = req.body;

    if (
      !fecha_conexion ||
      !id_contribuyente ||
      !cuenta ||
      !tipo ||
      !uso ||
      !ubicacion ||
      !barrio
    ) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const actualizarConexion = await Conexion.putConexion(
      id,
      fecha_conexion,
      id_contribuyente,
      cuenta,
      tipo,
      uso,
      ubicacion,
      barrio
    );

    res.status(201).json({
      success: true,
      message: 'Conexión actualizada exitosamente',
      actualizarConexion
    });
  } catch (error) {
    console.error('Error al actualizar conexión:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Eliminar una conexión
exports.deleteConexion = async (req, res) => {
  try {
    const { id } = req.params;
    await Conexion.deleteConexion(id);
    res.status(200).json({ success: true, message: 'Conexión eliminada' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al eliminar conexión' });
  }
};

// Obtener una conexión por ID
exports.getConexionById = async (req, res) => {
  try {
    const { id } = req.params;
    const conexion = await Conexion.getConexionById(id);
    if (!conexion) {
      return res.status(404).json({ error: 'Conexión no encontrada' });
    }
    res.json(conexion);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
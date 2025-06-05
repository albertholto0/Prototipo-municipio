const Configuracion = require("../models/gestionConfiguracionModel");

// Controlador para gestionar configuracion
exports.getAllConfiguracion = async (req, res) => {
  try {
    const configuracion = await Configuracion.getAll();
    res.json(configuracion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

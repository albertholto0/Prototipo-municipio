const CorteCaja = require("../models/gestionCorteCajaModel");

exports.getAllCorteCaja = async (req, res) => {
  try {
    const corteCaja = await CorteCaja.getAll();
    res.json(corteCaja);
  } catch (error) {
    console.error("Error en controlador:", error);  // Log adicional
    res.status(500).json({ 
      message: error.message || "Error interno del servidor" 
    });
  }
};

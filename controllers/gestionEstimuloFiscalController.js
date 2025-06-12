const EstimuloFiscal = require("../models/gestionEstimuloFiscalModel");

exports.getAllEstimuloFiscal = async (req, res) => {
  try {
    const estimuloFiscal = await EstimuloFiscal.getAll();
    res.json(estimuloFiscal);
  } catch (error) {
    console.error("Error en controlador:", error);  // Log adicional
    res.status(500).json({ 
      message: error.message || "Error interno del servidor" 
    });
  }
};
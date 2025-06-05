const EstimuloFiscal = require("../models/gestionEstimuloFiscalModel");

// Controlador para gestionar estimulos fiscales

exports.getAllEstimuloFiscal = async (req, res) => {
  try {
    const estimulosFiscales = await EstimuloFiscal.getAll();
    res.json(estimulosFiscales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

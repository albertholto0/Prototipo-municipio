const EstimuloFiscal = require("../models/gestionEstimuloFiscalModel");

const getAllEstimuloFiscal = async (req, res) => {
  try {
    const estimuloFiscal = await EstimuloFiscal.getAll();
    res.json(estimuloFiscal);
  } catch (error) {
    console.error("Error en controlador:", error);  // Log adicional
    res.status(500).json({ 
      message: 'Error al obtener registros de estímulos fiscales',
    });
  }
};

const getEstimuloFiscalById = async (req, res) => {
  try {
    const estimuloFiscal = await EstimuloFiscal.getById(req.params.id); 
    if (!estimuloFiscal) {
      return res.status(404).json({ message: "Estímulo fiscal no encontrado" });
    }
    res.json(estimuloFiscal);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error interno del servidor"
    });
  }
};
const createEstimuloFiscal = async (req, res) => {
  try {
    const nuevoEstimulo = await EstimuloFiscal.create(req.body);
    res.status(201).json(nuevoEstimulo);
  } catch (error) {
    console.error( error);
    res.status(500).json({
      message: "Error interno del servidor"
    });
  }
};

const updateEstimuloFiscal = async (req, res) => {
  try {
    const actualizado = await EstimuloFiscal.update(req.params.id, req.body);
    res.json(actualizado);
  } catch (error) {
    console.error( error);
    res.status(500).json({
      message: "Error interno del servidor"
    });
  }
};

const deleteEstimuloFiscal = async (req, res) => {
  try {
    await EstimuloFiscal.delete(req.params.id);
    res.status(204).end();
  } catch (error) {
    console.error( error);
    res.status(500).json({
      message:"Error interno del servidor"
    });
  }
};

module.exports = {
  getAllEstimuloFiscal, 
  getEstimuloFiscalById,
  createEstimuloFiscal, 
  updateEstimuloFiscal,
  deleteEstimuloFiscal
    };

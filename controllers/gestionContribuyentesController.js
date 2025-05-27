const Contribuyente = require('../models/gestionContribuyenteModel');
// Controlador para gestionar contribuyentes

exports.getAllContribuyentes = async (req, res) => {
  try {
    const contribuyentes = await Contribuyente.getAll();
    res.json(contribuyentes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Agregar más métodos de controlador según necesites
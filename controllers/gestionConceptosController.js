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
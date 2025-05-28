const Establecimiento = require("../models/gestionEstablecimientoModel");

// Controlador para gestionar establecimientos

exports.getAllEstablecimientos = async (req, res) => {
  try {
    const establecimientos = await Establecimiento.getAll();
    res.json(establecimientos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
exports.getEstablecimientoById = async (req, res) => {
  try {
    const id = req.params.id;
    const establecimiento = await Establecimiento.getById(id);

    if (!establecimiento) {
      return res.status(404).json({ message: "Establecimiento no encontrado" });
    }

    res.json(establecimiento);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};*/

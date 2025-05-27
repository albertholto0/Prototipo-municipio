const Usuarios = require('../models/usuariosModel');
// Controlador para gestionar usuarios

exports.getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuarios.getAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
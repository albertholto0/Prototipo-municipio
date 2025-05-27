const Contribuyente = require('../models/gestionContribuyenteModel');
// Controlador para gestionar contribuyentes

const Usuarios = require('../models/usuariosModel');
// Controlador para gestionar usuarios

exports.getAllContribuyentes = async (req, res) => {
  try {
    const contribuyentes = await Contribuyente.getAll();
    res.json(contribuyentes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Agregar más métodos de controlador según necesites

exports.getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuarios.getAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
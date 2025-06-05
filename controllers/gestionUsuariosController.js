// gestionUsuariosController.js
const Usuarios = require('../models/gestionUsuariosModel');
const bcrypt = require('bcryptjs');

exports.getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuarios.getAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createUsuario = async (req, res) => {
  try {
    const { nombres, apellido_paterno, apellido_materno, usuario, password, rol_usuario } = req.body;

    if (!nombres || !usuario || !password || !rol_usuario) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const userId = await Usuarios.create(
      nombres,
      apellido_paterno || '',
      apellido_materno || '',
      usuario,
      password,
      rol_usuario
    );

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      userId
    });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor' 
    });
  }
};
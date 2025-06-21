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

exports.updateUsuario = async (req, res) => {
  try {
    const { id_usuario, nombres, apellido_paterno, apellido_materno, usuario, rol_usuario } = req.body;

    if (!id_usuario || !nombres || !usuario || !rol_usuario) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const updated = await Usuarios.update(
      id_usuario,
      nombres,
      apellido_paterno || '',
      apellido_materno || '',
      usuario,
      rol_usuario
    );

    if (!updated) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ 
      success: true,
      message: 'Usuario actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor' 
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { id_usuario, newPassword } = req.body;

    if (!id_usuario || !newPassword) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const updated = await Usuarios.resetPassword(id_usuario, newPassword);

    if (!updated) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ 
      success: true,
      message: 'Contraseña reseteada exitosamente'
    });

  } catch (error) {
    console.error('Error al resetear contraseña:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor' 
    });
  }
};

// Cambiar estado del usuario
exports.toggleUsuarioStatus = async (req, res) => {
  try {
    const { id_usuario } = req.body;

    if (!id_usuario) {
      return res.status(400).json({ error: 'Falta el ID del usuario' });
    }

    const updated = await Usuarios.toggleStatus(id_usuario);

    if (!updated) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ 
      success: true,
      message: 'Estado del usuario actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error al cambiar estado del usuario:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor' 
    });
  }
};
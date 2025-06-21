const express = require('express');
const Usuarios = require('../models/gestionUsuariosModel');
const router = express.Router();

// Obtener todos los usuarios (GET)
router.get('/', async (req, res) => {
    try {
        const usuarios = await Usuarios.getAll();
        res.json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// Registrar nuevo usuario (POST)
router.post('/', async (req, res) => {
    try {
        const { nombres, apellido_paterno, apellido_materno, usuario, password, rol_usuario } = req.body;
        const userId = await Usuarios.create(
            nombres,
            apellido_paterno,
            apellido_materno,
            usuario,
            password,
            rol_usuario
        );
        res.status(201).json({ mensaje: 'Usuario registrado exitosamente', userId });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

// Obtener usuario por nombre de usuario (GET)
router.get('/:usuario', async (req, res) => {
    try {
        const { usuario } = req.params;
        const user = await Usuarios.getByUsername(usuario);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
});

// Actualizar usuario (PUT)
router.put('/', async (req, res) => {
    try {
        const { id_usuario, nombres, apellido_paterno, apellido_materno, usuario, rol_usuario } = req.body;
        const updated = await Usuarios.update(
            id_usuario,
            nombres,
            apellido_paterno,
            apellido_materno,
            usuario,
            rol_usuario
        );
        if (!updated) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ mensaje: 'Usuario actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
});

// Resetear contraseña (POST)
router.post('/reset-password', async (req, res) => {
    try {
        const { id_usuario, newPassword } = req.body;
        const updated = await Usuarios.resetPassword(id_usuario, newPassword);
        if (!updated) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ mensaje: 'Contraseña reseteada exitosamente' });
    } catch (error) {
        console.error('Error al resetear contraseña:', error);
        res.status(500).json({ error: 'Error al resetear contraseña' });
    }
});

module.exports = router;

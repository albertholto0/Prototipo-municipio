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

module.exports = router;

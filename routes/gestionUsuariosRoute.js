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
        const { nombres, apellido_paterno, apellido_materno, usuario, password, rol_usuario, foto_perfil } = req.body;
        const userId = await Usuarios.create(
            nombres,
            apellido_paterno,
            apellido_materno,
            usuario,
            password,
            rol_usuario,
            foto_perfil
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
        const { id_usuario, nombres, apellido_paterno, apellido_materno, usuario, rol_usuario, foto_perfil } = req.body;
        const updated = await Usuarios.update(
            id_usuario,
            nombres,
            apellido_paterno,
            apellido_materno,
            usuario,
            rol_usuario,
            foto_perfil
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

// Cambiar estado del usuario (POST)
router.post('/toggle-status', async (req, res) => {
    try {
        const { id_usuario } = req.body;
        const updated = await Usuarios.toggleStatus(id_usuario);
        
        if (!updated) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        res.json({ 
            mensaje: 'Estado del usuario actualizado exitosamente',
            nuevoEstado: updated.nuevoEstado 
        });
    } catch (error) {
        console.error('Error al cambiar estado del usuario:', error);
        res.status(500).json({ error: 'Error al cambiar estado del usuario' });
    }
});

// Obtener por ID de usuario (GET)
router.get('/id/:id_usuario', async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const user = await Usuarios.getById(id_usuario);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error al obtener usuario por ID:', error);
        res.status(500).json({ error: 'Error al obtener usuario por ID' });
    }
});

// Verificar contraseña (POST) usando getPasswordById
router.post('/verify-password', async (req, res) => {
    try {
        const { id_usuario, password } = req.body;
        const storedPassword = await Usuarios.getPasswordById(id_usuario);
        
        if (!storedPassword) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        if (storedPassword === password) {
            res.json({ mensaje: 'Contraseña verificada correctamente' });
        } else {
            res.status(401).json({ error: 'Contraseña incorrecta' });
        }
    } catch (error) {
        console.error('Error al verificar contraseña:', error);
        res.status(500).json({ error: 'Error al verificar contraseña' });
    }
});

module.exports = router;

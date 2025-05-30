const express = require('express');
const Usuarios = require('../models/gestionUsuariosModel');
const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const usuarios = await Usuarios.getAll();
        res.json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
    }
});

module.exports = router;

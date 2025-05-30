const express = require('express');
const Conceptos = require('../models/gestionConceptosModel');
const { route } = require('./gestionContribuyenteRoute');
const router = express.Router();
// Ruta para obtener todos los conceptos
router.get('/', async (req, res) => {
    try {
        const conceptos = await Conceptos.getAll();
        res.json(conceptos);
    } catch (error) {
        console.error('Error al obtener conceptos:', error);
        res.status(500).json({ message: 'Error al obtener conceptos' });
    }
});

module.exports = router;
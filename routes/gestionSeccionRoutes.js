const express = require('express');
const Seccion = require('../models/gestionSeccionModel');
const router = express.Router();

// Ruta para obtener todas las secciones
router.get('/', async (req, res) => {
  try {
    const secciones = await Seccion.getAll();
    res.json(secciones);
  } catch (err) {
    console.error('Error al obtener secciones:', err);
    res.status(500).json({ error: 'Error al obtener secciones' });
  }
});

module.exports = router;
const express = require('express');
const CorteCaja = require('../models/gestionCorteCajaModel');
const router = express.Router();

// Ruta para obtener todos los contribuyentes
router.get('/', async (req, res) => {
  try {
    const CorteCaja = await CorteCaja.getAll();
    res.json(CorteCaja);
  } catch (err) {
    console.error('Error al obtener Corte de caja:', err);
    res.status(500).json({ error: 'Error al obtener Corte de caja' });
  }
});

module.exports = router;


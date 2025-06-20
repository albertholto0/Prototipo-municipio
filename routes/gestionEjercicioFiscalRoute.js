const express = require('express');
const EjercicioFiscal = require('../models/gestionEjercicioFiscalModel');

const router = express.Router();

// Ruta para obtener todos los ejercicios fiscales
router.get('/', async (req, res) => {
  try {
    const ejercicios = await EjercicioFiscal.getAll();  // Usar variable diferente
    res.json(ejercicios);
  } catch (err) {
    console.error('Error al obtener los ejercicios fiscales:', err);
    res.status(500).json({ error: 'Error al obtener los ejercicios fiscales' });
  }
});

module.exports = router;

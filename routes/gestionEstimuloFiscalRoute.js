const express = require('express');
const EstimuloFiscal = require('../models/gestionEstimuloFiscalModel');
const router = express.Router();

// Ruta para obtener todos los contribuyentes
router.get('/', async (req, res) => {
  try {
    const EstimulosFiscales = await EstimuloFiscal.getAll();
    res.json(EstimulosFiscales);
  } catch (err) {
    console.error('Error al obtener Estimulos fiscales:', err);
    res.status(500).json({ error: 'Error al obtener Estimulos fiscales' });
  }
});

module.exports = router;
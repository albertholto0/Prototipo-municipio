// filepath: /home/rafaeldiaz/Documentos/Sexto Semestre/Ingenieria de Software II/Prototipo-municipio/routes/gestionContribuyenteRoute.js
const express = require('express');
const EjercicioFiscal = require('../models/gestionEjercicioFiscalModel');
const router = express.Router();

// Ruta para obtener todos los contribuyentes
router.get('/', async (req, res) => {
  try {
    const EjercicioFiscal = await Contribuyente.getAll();
    res.json(EjercicioFiscal);
  } catch (err) {
    console.error('Error al obtener los ejercicios fiscales:', err);
    res.status(500).json({ error: 'Error al obtener los ejercicios fiscales' });
  }
});

module.exports = router;
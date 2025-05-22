// filepath: /home/rafaeldiaz/Documentos/Sexto Semestre/Ingenieria de Software II/Prototipo-municipio/routes/gestionContribuyenteRoute.js
const express = require('express');
const Contribuyente = require('../models/gestionContribuyenteModel');
const router = express.Router();

// Ruta para obtener todos los contribuyentes
router.get('/', async (req, res) => {
  try {
    const contribuyentes = await Contribuyente.getAll();
    res.json(contribuyentes);
  } catch (err) {
    console.error('Error al obtener contribuyentes:', err);
    res.status(500).json({ error: 'Error al obtener contribuyentes' });
  }
});

module.exports = router;
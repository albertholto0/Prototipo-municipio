const express = require('express');
const GestionSeccionController = require('../controllers/gestionSeccionController');
const router = express.Router();

// Ruta para obtener todas las secciones
router.get('/', GestionSeccionController.getAllSecciones);

// Ruta para buscar una sección por clave
router.get('/:clave_seccion', GestionSeccionController.getSeccionById);

module.exports = router;
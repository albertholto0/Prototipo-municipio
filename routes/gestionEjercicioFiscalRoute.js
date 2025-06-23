const express = require('express');
const router = express.Router();
const ejercicioFiscalController = require('../controllers/gestionEjercicioFiscalController');

// Obtener todos los ejercicios fiscales
router.get('/', ejercicioFiscalController.getAllEjercicios);

// Obtener ejercicio fiscal por ID
router.get('/:id', ejercicioFiscalController.getById);

// Registrar nuevo ejercicio fiscal
router.post('/', ejercicioFiscalController.createEjercicio);

// Actualizar ejercicio fiscal
router.put('/:id', ejercicioFiscalController.updateEjercicio);

// Eliminar ejercicio fiscal
router.delete('/:id', ejercicioFiscalController.deleteEjercicio);

module.exports = router;

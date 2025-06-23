const express = require('express');
const router = express.Router();
const reciboController = require('../controllers/gestionReciboController');

// Health check - para verificar que el servicio funciona
router.get('/health', reciboController.healthCheck);

// Buscar recibos por filtros (debe ir antes de las rutas con parámetros)
router.get('/buscar/filtros', reciboController.getByFilters);

// Obtener todos los recibos
router.get('/', reciboController.getAllRecibos);

// Crear un nuevo recibo
router.post('/', reciboController.createRecibo);

// Obtener un recibo por ID
router.get('/:id', reciboController.getById);

// Actualizar un recibo
router.put('/:id', reciboController.updateRecibo);

// Eliminar un recibo
router.delete('/:id', reciboController.deleteRecibo);

module.exports = router;
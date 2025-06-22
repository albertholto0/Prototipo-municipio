const express = require('express');
const GestionHistorialAccesosController = require('../controllers/gestionHistorialAccesosController');
const router = express.Router();

//Obtener historial de accesos (GET)
router.get('/', GestionHistorialAccesosController.obtenerHistorial);

router.get('/:id', GestionHistorialAccesosController.obtenerHistorialPorUsuario);

// Obtener todos los historiales de accesos por ID de usuario (GET)
router.get('/all/:id', GestionHistorialAccesosController.obtenerTodosLosHistorialesPorUsuario);

module.exports = router;
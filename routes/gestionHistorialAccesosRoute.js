const express = require('express');
const GestionHistorialAccesosController = require('../controllers/gestionHistorialAccesosController');
const router = express.Router();

//Obtener historial de accesos (GET)
router.get('/', GestionHistorialAccesosController.obtenerHistorial);

router.get('/:id', GestionHistorialAccesosController.obtenerHistorialPorUsuario);

module.exports = router;
const express = require('express');
const router = express.Router();
const conexionController = require('../controllers/gestionConexionController');

// Obtener todas las conexiones
router.get('/', conexionController.getAllConexiones);

// Obtener una conexión por ID
router.get('/:id', conexionController.getConexionById);

// Registrar una nueva conexión
router.post('/', conexionController.setConexion);

// Actualizar una conexión existente
router.put('/:id', conexionController.putConexion);

// Eliminar una conexión
router.delete('/:id', conexionController.deleteConexion);

module.exports = router;
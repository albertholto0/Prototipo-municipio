const express = require('express');
const GestionSeccionController = require('../controllers/gestionSeccionController');
const router = express.Router();

// Ruta para obtener todas las secciones
router.get('/', GestionSeccionController.getAllSecciones);

// Registrar una nueva subcuenta contable
router.post('/', GestionSeccionController.setSeccion);

// Ruta para buscar una sección por clave
router.get('/:clave_seccion', GestionSeccionController.getSeccionById);

// Eliminar una subcuenta contable
router.delete('/:clave_seccion', GestionSeccionController.deleteSeccion);

// Actualizar una subcuenta contable
router.put('/:clave_seccion', GestionSeccionController.putSeccion);


module.exports = router;
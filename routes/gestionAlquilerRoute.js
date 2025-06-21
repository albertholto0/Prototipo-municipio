//Sergio Elias Robles Ignacio 
// Gestion de Alquileres
//Este Archivo es el encargado de manejar las rutas de los alquileres
const express = require('express');
const router = express.Router();
const alquilerController = require('../controllers/gestionAlquilerController');

// Obtener todos los alquileres
router.get('/', alquilerController.getAllAlquileres);

// Registrar un nuevo alquiler
router.post('/', alquilerController.setAlquiler);

// Actualizar un alquiler existente
router.put('/:id', alquilerController.putAlquiler);

// Eliminar un alquiler
router.delete('/:id', alquilerController.deleteAlquiler);

module.exports = router;
const express = require('express');
const router = express.Router();
const contribuyenteController = require('../controllers/gestionContribuyentesController');

// Obtener todos los contribuyentes
router.get('/', contribuyenteController.getAllContribuyentes);

// Registrar un nuevo contribuyente
router.post('/', contribuyenteController.setContribuyente);

// Actualizar un contribuyente
router.put('/:id', contribuyenteController.putContribuyente);

router.delete('/:id', contribuyenteController.deleteContribuyente);

module.exports = router;
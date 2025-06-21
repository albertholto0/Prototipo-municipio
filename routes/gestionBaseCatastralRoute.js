const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/gestionBaseCatastralControllers');

// Listar todo
router.get('/', ctrl.getAllBases);
// Ver uno
router.get('/:id', ctrl.getBaseById);
// Crear
router.post('/', ctrl.createBase);
// Actualizar
router.put('/:id', ctrl.updateBase);
// Eliminar
router.delete('/:id', ctrl.deleteBase);

module.exports = router;

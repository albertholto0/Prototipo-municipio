const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/gestionCuentasContablesController');

// Listar todas las cuentas contables
router.get('/', ctrl.getAllCuentas);

// Ver una cuenta contable por ID
router.get('/:id', ctrl.getCuentaById);

// Crear una nueva cuenta contable
router.post('/', ctrl.createCuenta);

// Actualizar una cuenta contable
router.put('/:id', ctrl.updateCuenta);

// Eliminar una cuenta contable
router.delete('/:id', ctrl.deleteCuenta);

// Toggle de estado (activo/inactivo)
router.post('/toggle-estado', ctrl.toggleEstado);

module.exports = router;

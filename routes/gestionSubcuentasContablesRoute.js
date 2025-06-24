const express = require('express');
const router = express.Router();
const subcuentasController = require('../controllers/gestionSubcuentasContablesController');

// Obtener todas las subcuentas contables
router.get('/', subcuentasController.getAllSubcuentas);
// Registrar una nueva subcuenta contable
router.post('/', subcuentasController.setSubcuentas);
// Eliminar una subcuenta contable
router.delete('/:clave_subcuenta', subcuentasController.deleteSubcuenta);
// Obtener una subcuenta contable por ID (clave_subcuenta)
router.get('/:clave_subcuenta', subcuentasController.getSubcuentaById);
// Actualizar una subcuenta contable
router.put('/:clave_subcuenta', subcuentasController.putSubcuenta);

module.exports = router;
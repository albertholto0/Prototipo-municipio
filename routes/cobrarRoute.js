const express = require('express');
const controller = require('../controllers/cobrarController');
const router = express.Router();

router.get('/cuentas', controller.getCuentas);
router.get('/subcuentas/:cuentaId', controller.getSubcuentas);
router.get('/secciones/:subcuentaId', controller.getSecciones);
router.get('/conceptos/:seccionId', controller.getConceptos);
router.get('/subconceptos/:conceptoId', controller.getSubconceptos);

module.exports = router;
const express = require('express');
const controller = require('../controllers/cobrarController');
const router = express.Router();

router.get('/cuentas', controller.getCuentas);
router.get('/subcuentas/:cuentaId', controller.getSubcuentas);
router.get('/secciones/:subcuentaId', controller.getSecciones);
router.get('/conceptos/:seccionId', controller.getConceptos);
router.get('/subconceptos/:conceptoId', controller.getSubconceptos);
router.get('/conexiones/:contribuyenteId', controller.getConexiones);
router.get('/bases/:contribuyenteId', controller.getBaseCatastrales);
router.post('/', controller.setRecibo);

module.exports = router;
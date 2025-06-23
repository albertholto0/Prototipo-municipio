const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/gestionEstimuloFiscalController'); 

router.get('/', ctrl.getAllEstimuloFiscal);
router.get('/:id', ctrl.getEstimuloFiscalById);
router.post('/', ctrl.createEstimuloFiscal);
router.put('/:id', ctrl.updateEstimuloFiscal);
router.delete('/:id', ctrl.deleteEstimuloFiscal);

module.exports = router;
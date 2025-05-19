const express = require('express');
const router = express.Router();
const contribuyenteController = require('../controllers/gestionContribuyentesController');
// Importar el controlador de contribuyentes

router.get('/', contribuyenteController.getAllContribuyentes);
// Agregar más rutas según necesites

module.exports = router;
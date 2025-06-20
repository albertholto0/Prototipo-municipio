const express = require('express');
const gestionBaseCatastral = require('../models/gestionBaseCatastralModel');
const { route } = require('./gestionContribuyenteRoute');
const router = express.Router();

// Ruta para obtener todos los registros de la base catastral   
router.get('/', async (req, res) => {
    try {
        const registros = await gestionBaseCatastral.getAll();
        res.json(registros);
    } catch (error) {
        console.error('Error al obtener registros de la base catastral:', error);
        res.status(500).json({ message: 'Error al obtener registros de la base catastral' });
    }
});
module.exports = router;
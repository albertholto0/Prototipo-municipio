const express = require('express');
const SubcuentasContables = require('../models/gestionSubcuentasContablesModel');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const subcuentas = await SubcuentasContables.getAll();
        res.json(subcuentas);
    } catch (err) {
        console.error('Error al obtener subcuentas contables:', err);
        res.status(500).json({ error: 'Error al obtener subcuentas contables' });
    }
});

module.exports = router;
const express = require('express');
const CuentasContables = require('../models/gestionCuentasContablesModel');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const cuentasContables = await CuentasContables.getAll();
        res.json(cuentasContables);
    } catch (err) {
        console.error('Error al obtener cuentas contables:', err);
        res.status(500).json({ error: 'Error al obtener cuentas contables' });
    }
});

module.exports = router;
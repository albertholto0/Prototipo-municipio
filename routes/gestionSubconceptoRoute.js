const express = require('express');
const Subconceptos = require('../models/gestionSubconceptosModel');
const router = express.Router();

// Ruta para obtener todos los subconceptos
router.get('/', async (req, res) => {
    try {
        const subconceptos = await Subconceptos.getAll();
        res.json(subconceptos);
    } catch (error) {
        console.error('Error al obtener subconceptos:', error);
        res.status(500).json({ message: 'Error al obtener subconceptos' });
    }
});

// Ruta para registrar un nuevo subconcepto
router.post('/', async (req, res) => {
    try {
        const { clave_subconcepto, clave_concepto, descripcion, tipo_servicio, cuota, periodicidad } = req.body;
        
        if (!clave_subconcepto || !clave_concepto || !descripcion || !tipo_servicio || !cuota || !periodicidad) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const subconceptoId = await Subconceptos.create(
            clave_subconcepto,
            clave_concepto,
            descripcion,
            tipo_servicio,
            cuota,
            periodicidad
        );
        
        res.status(201).json({ 
            success: true,
            message: 'Subconcepto registrado exitosamente', 
            subconceptoId 
        });
        
    } catch (error) {
        console.error('Error detallado al registrar subconcepto:', error);
        res.status(500).json({ 
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
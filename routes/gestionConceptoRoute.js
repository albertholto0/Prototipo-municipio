const express = require('express');
const Conceptos = require('../models/gestionConceptosModel');
const { route } = require('./gestionContribuyenteRoute');
const router = express.Router();
// Ruta para obtener todos los conceptos
router.get('/', async (req, res) => {
    try {
        const conceptos = await Conceptos.getAll();
        res.json(conceptos);
    } catch (error) {
        console.error('Error al obtener conceptos:', error);
        res.status(500).json({ message: 'Error al obtener conceptos' });
    }
});

// Ruta para registrar un nuevo concepto
router.post('/', async (req, res) => {
    try {
        const { clave_concepto, clave_seccion, nombre_conceptos, descripcion, tipo_servicio } = req.body;
        
        if (!clave_concepto || !clave_seccion || !nombre_conceptos || !descripcion || !tipo_servicio) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const conceptoId = await Conceptos.create(
            clave_concepto,
            clave_seccion,
            nombre_conceptos,
            descripcion,
            tipo_servicio
        );
        
        res.status(201).json({ 
            success: true,
            message: 'Concepto registrado exitosamente', 
            conceptoId 
        });
        
    } catch (error) {
        console.error('Error detallado al registrar concepto:', error);
        res.status(500).json({ 
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
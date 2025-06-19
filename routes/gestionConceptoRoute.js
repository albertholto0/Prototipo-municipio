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
        const { clave_concepto, clave_seccion, descripcion, tipo_servicio, cuota, periodicidad } = req.body;
        
        if (!clave_concepto || !clave_seccion || !descripcion || !tipo_servicio || !cuota || !periodicidad) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const conceptoId = await Conceptos.create(
            clave_concepto,
            clave_seccion,
            descripcion,
            tipo_servicio,
            cuota,
            periodicidad
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

// Ruta para actualizar un concepto
router.put('/:clave_concepto', async (req, res) => {
    try {
        const { clave_concepto } = req.params;
        const { clave_seccion, descripcion, tipo_servicio, cuota, periodicidad } = req.body;

        if (!clave_seccion || !descripcion || !tipo_servicio || !cuota || !periodicidad) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        await Conceptos.update(
            clave_seccion,
            clave_concepto,
            descripcion,
            tipo_servicio,
            cuota,
            periodicidad
        );
        
        res.status(200).json({ 
            success: true,
            message: 'Concepto actualizado exitosamente'
        });
        
    } catch (error) {
        console.error('Error al actualizar concepto:', error);
        res.status(500).json({ 
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Subconceptos = require('../models/gestionSubconceptosModel');

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

// Ruta para obtener un subconcepto por clave_subconcepto
router.get('/:clave_subconcepto', async (req, res) => {
    try {
        const subconcepto = await Subconceptos.getById(req.params.clave_subconcepto);
        if (!subconcepto) {
            return res.status(404).json({ message: 'Subconcepto no encontrado' });
        }
        res.json(subconcepto);
    } catch (error) {
        console.error('Error al obtener subconcepto:', error);
        res.status(500).json({ message: 'Error al obtener subconcepto' });
    }
});

// Ruta para actualizar un subconcepto
router.put('/:clave_subconcepto_actual', async (req, res) => {
    try {
        const { nueva_clave_subconcepto, nueva_clave_concepto, descripcion, tipo_servicio, cuota, periodicidad } = req.body;
        
        if (!nueva_clave_subconcepto || !nueva_clave_concepto || !descripcion || !tipo_servicio || !cuota || !periodicidad) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const updated = await Subconceptos.update(
            req.params.clave_subconcepto_actual,
            nueva_clave_subconcepto,
            nueva_clave_concepto,
            descripcion,
            tipo_servicio,
            cuota,
            periodicidad
        );
        
        if (!updated) {
            return res.status(404).json({ message: 'Subconcepto no encontrado' });
        }
        
        res.json({ 
            success: true,
            message: 'Subconcepto actualizado exitosamente'
        });
        
    } catch (error) {
        console.error('Error al actualizar subconcepto:', error);
        res.status(500).json({ 
            success: false,
            error: error.message
        });
    }
});

// Ruta para eliminar un subconcepto
router.delete('/:clave_subconcepto', async (req, res) => {
    try {
        const { password } = req.body;
        
        const deleted = await Subconceptos.delete(req.params.clave_subconcepto);
        
        if (!deleted) {
            return res.status(404).json({ message: 'Subconcepto no encontrado' });
        }
        
        res.json({ 
            success: true,
            message: 'Subconcepto eliminado exitosamente'
        });
        
    } catch (error) {
        console.error('Error al eliminar subconcepto:', error);
        res.status(500).json({ 
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
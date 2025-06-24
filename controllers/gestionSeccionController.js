const Seccion = require('../models/gestionSeccionModel');
// Controlador para gestionar secciones
exports.getAllSecciones = async (req, res) => {
    try {
        const secciones = await Seccion.getAll();
        res.json(secciones);
    } catch (error) {
        console.error('Error al obtener secciones:', error);
        res.status(500).json({ message: 'Error al obtener secciones' });
    }
};

exports.setSeccion = async (req, res) => {
    try {
        const { clave_seccion, clave_subcuenta, descripcion } = req.body;

        if (!clave_seccion || !descripcion) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const seccion = await Seccion.setSeccion(clave_subcuenta, clave_seccion, descripcion);
        res.status(201).json({
            success: true,
            message: 'Sección registrada exitosamente',
            seccion
        });

    } catch (error) {
        console.error('Error al registrar sección:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
}

exports.deleteSeccion = async (req, res) => {
    try {
        const { clave_seccion } = req.params;

        if (!clave_seccion) {
            return res.status(400).json({ error: 'Falta la clave de la sección' });
        }

        await Seccion.deleteSeccion(clave_seccion);
        res.status(200).json({
            success: true,
            message: 'Sección eliminada exitosamente'
        });

    } catch (error) {
        console.error('Error al eliminar la sección:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
}
exports.getSeccionById = async (req, res) => {
    try {
        const { clave_seccion } = req.params;
        const seccion = await Seccion.getSeccionById(clave_seccion);
        res.json(seccion);
    } catch (error) {
        console.error('Error al obtener la sección:', error);
        if (error.message === 'Sección no encontrada') {
            return res.status(404).json({ message: 'Sección no encontrada' });
        }
        res.status(500).json({ message: 'Error al obtener la sección' });
    }
};

exports.putSeccion = async (req, res) => {
    try {
        const { clave_seccion, clave_subcuenta, descripcion } = req.body;

        if (!clave_seccion || !descripcion) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        await Seccion.putSeccion(clave_seccion, clave_subcuenta, descripcion);
        res.status(200).json({
            success: true,
            message: 'Sección actualizada exitosamente'
        });

    } catch (error) {
        console.error('Error al actualizar la sección:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
};
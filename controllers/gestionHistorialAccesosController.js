const HistorialAccesos = require('../models/gestionHistorialAccesosModel');

// Controlador para gestionar el historial de accesos
class GestionHistorialAccesosController {
    static async obtenerHistorial(req, res) {
        try {
            const historial = await HistorialAccesos.getAll();
            res.json(historial);
        } catch (err) {
            res.status(500).json({ error: 'Error al obtener historial de accesos' });
        }
    }
    static async obtenerHistorialPorUsuario(req, res) {
        try {
            const { id } = req.params;
            const historial = await HistorialAccesos.getByIdUser(id);
            res.json(historial);
        } catch (err) {
            res.status(500).json({ error: 'Error al obtener historial' });
        }
    }

    static async obtenerTodosLosHistorialesPorUsuario(req, res) {
        try {
            const { id } = req.params;
            const historiales = await HistorialAccesos.getAllByIdUser(id);
            res.json(historiales);
        } catch (err) {
            res.status(500).json({ error: 'Error al obtener todos los historiales de accesos' });
        }
    }
}

module.exports = GestionHistorialAccesosController;

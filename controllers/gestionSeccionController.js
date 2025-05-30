const Seccion = require('../models/gestionSeccionModel'); 
// Controlador para gestionar secciones
class GestionSeccionController {
    static async getAllSecciones(req, res) {
        try {
            const secciones = await Seccion.getAll();
            res.json(secciones);
        } catch (error) {
            console.error('Error al obtener secciones:', error);
            res.status(500).json({ message: 'Error al obtener secciones' });
        }
    }

    static async getSeccionById(req, res) {
        const { clave_seccion } = req.params;
        try {
            const seccion = await Seccion.getById(clave_seccion);
            if (!seccion) {
                return res.status(404).json({ message: 'Sección no encontrada' });
            }
            res.json(seccion);
        } catch (error) {
            console.error('Error al buscar la sección:', error);
            res.status(500).json({ message: 'Error al buscar la sección' });
        }
    }
}

module.exports = GestionSeccionController;
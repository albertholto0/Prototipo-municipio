const Seccion = require('../models/gestionSeccionModel'); 
// Controlador para gestionar secciones

exports.getAllSecciones = async (req, res) => {
    try {
        const secciones = await Seccion.getAll();
        res.json(secciones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
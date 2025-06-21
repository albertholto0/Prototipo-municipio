const EjercicioFiscalModel = require('../models/gestionEjercicioFiscalModel');

exports.getAllEjerciciosFiscales = async (req, res) => {
    try {
        const ejercicios = await EjercicioFiscalModel.getAll();
        res.json(ejercicios);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
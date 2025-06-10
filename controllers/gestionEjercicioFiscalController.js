const EjercicioFiscal = require('../models/gestionEjercicioFiscalModel');

exports.getAllCuentasContables = async (req, res) => {
    try{
        const EjercicioFiscal = await EjercicioFiscal.getAll();
        res.json(EjercicioFiscal);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}
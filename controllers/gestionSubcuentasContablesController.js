const SubcuentasContables = require('../models/subcuentasContablesModel');

exports.getAllSubcuentas = async (req, res) => {
    try {
        const subcuentas = await SubcuentasContables.getAll();
        res.json(subcuentas);
    } catch (error) {
        console.error('Error al obtener subcuentas contables:', error);
        res.status(500).json({ message: 'Error al obtener subcuentas contables' });
    }
}

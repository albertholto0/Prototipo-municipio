const CuentaContable = require('../models/CuentasContablesModel');

exports.getAllCuentasContables = async (req, res) => {
    try{
        const cuentasContables = await CuentaContable.getAll();
        res.json(cuentasContables);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}
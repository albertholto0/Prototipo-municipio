const SubcuentasContables = require('../models/gestionSubcuentasContablesModel');

exports.getAllSubcuentas = async (req, res) => {
    try {
        const subcuentas = await SubcuentasContables.getAll();
        res.json(subcuentas);
    } catch (error) {
        console.error('Error al obtener subcuentas contables:', error);
        res.status(500).json({ message: 'Error al obtener subcuentas contables' });
    }
}

exports.setSubcuentas = async (req, res) => {
    try {
        const { clave_cuenta_contable, clave_subcuenta, nombre_subcuentas } = req.body;

        if (!clave_cuenta_contable || !clave_subcuenta || !nombre_subcuentas) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const subcuenta = await SubcuentasContables.setSucuenta(clave_cuenta_contable, clave_subcuenta, nombre_subcuentas);
        res.status(201).json({
            success: true,
            message: 'Subcuenta registrada exitosamente',
            subcuenta
        });

    } catch (error) {
        console.error('Error al registrar subcuenta:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
}
exports.deleteSubcuenta = async (req, res) => {
    try {
        const { clave_subcuenta } = req.params;

        if (!clave_subcuenta) {
            return res.status(400).json({ error: 'Falta la clave de la subcuenta' });
        }

        await SubcuentasContables.deleteSubcuenta(clave_subcuenta);
        res.status(200).json({
            success: true,
            message: 'Subcuenta eliminada exitosamente'
        });

    } catch (error) {
        console.error('Error al eliminar la subcuenta:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
}
exports.getSubcuentaById = async (req, res) => {
    try {
        const { clave_subcuenta } = req.params;

        if (!clave_subcuenta) {
            return res.status(400).json({ error: 'Falta la clave de la subcuenta' });
        }

        const subcuenta = await SubcuentasContables.getSubcuentaById(clave_subcuenta);
        res.json(subcuenta);

    } catch (error) {
        console.error('Error al obtener la subcuenta:', error);
        res.status(500).json({ message: 'Error al obtener la subcuenta' });
    }
}
exports.putSubcuenta = async (req, res) => {
    try {
        const { clave_subcuenta } = req.params;
        const { clave_cuenta_contable, nombre_subcuentas } = req.body;

        if (!clave_cuenta_contable || !nombre_subcuentas) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        await SubcuentasContables.putSubcuenta(clave_subcuenta, clave_cuenta_contable, nombre_subcuentas);
        res.status(200).json({
            success: true,
            message: 'Subcuenta actualizada exitosamente'
        });

    } catch (error) {
        console.error('Error al actualizar la subcuenta:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
}

// controllers/gestionSubcuentasContablesController.js

const SubcuentasContables = require('../models/gestionSubcuentasContablesModel');

exports.getAllSubcuentas = async (req, res) => {
  try {
    const subcuentas = await SubcuentasContables.getAll();
    res.json(subcuentas);
  } catch (error) {
    console.error('Error al obtener subcuentas contables:', error);
    res.status(500).json({ message: 'Error al obtener subcuentas contables' });
  }
};

exports.setSubcuentas = async (req, res) => {
  try {
    const { id_cuentaContable, clave_subcuenta, nombre } = req.body;
    if (!id_cuentaContable || !clave_subcuenta || !nombre) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    const subcuentaId = await SubcuentasContables.setSucuenta(
      id_cuentaContable,
      clave_subcuenta,
      nombre
    );
    res.status(201).json({
      success: true,
      message: 'Subcuenta registrada exitosamente',
      subcuentaId
    });
  } catch (error) {
    console.error('Error al ingresar la subcuenta:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

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
};

exports.putSubcuenta = async (req, res) => {
  try {
    const { clave_subcuenta } = req.params;
    const { id_cuentaContable, nombre } = req.body;
    if (!id_cuentaContable || !nombre) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    await SubcuentasContables.putSubcuenta(clave_subcuenta, id_cuentaContable, nombre);
    res.json({ success: true, message: 'Subcuenta actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar la subcuenta:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
};

/**
 * En lugar de eliminar físicamente, alterna estado 0/1.
 * Usamos la ruta DELETE para este toggle.
 */
exports.deleteSubcuenta = async (req, res) => {
  try {
    const { clave_subcuenta } = req.params;
    if (!clave_subcuenta) {
      return res.status(400).json({ error: 'Falta la clave de la subcuenta' });
    }
    const nuevoEstado = await SubcuentasContables.toggleEstado(clave_subcuenta);
    res.json({
      success: true,
      message: `Subcuenta ${
        nuevoEstado === 1 ? 'activada' : 'desactivada'
      } correctamente`
    });
  } catch (error) {
    console.error('Error al alternar estado de la subcuenta:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const CuentasContables = require('../models/gestionCuentasContablesModel');

// Obtener todas las cuentas contables
exports.getAllCuentas = async (req, res) => {
  try {
    const cuentas = await CuentasContables.getAll();
    res.json(cuentas);
  } catch (err) {
    console.error('Error al obtener cuentas:', err);
    res.status(500).json({ error: 'Error al obtener cuentas contables' });
  }
};

// Obtener una cuenta por ID
exports.getCuentaById = async (req, res) => {
  const { id } = req.params;
  try {
    const cuentas = await CuentasContables.getAll(); 
    const cuenta = cuentas.find(c => c.id_cuentaContable == id);
    if (cuenta) {
      res.json(cuenta);
    } else {
      res.status(404).json({ error: 'Cuenta no encontrada' });
    }
  } catch (err) {
    console.error('Error al buscar cuenta:', err);
    res.status(500).json({ error: 'Error al buscar cuenta contable' });
  }
};

// Crear nueva cuenta contable
exports.createCuenta = async (req, res) => {
  try {
    const nueva = await CuentasContables.create(req.body);
    res.status(201).json(nueva);
  } catch (err) {
    console.error('Error al crear cuenta:', err);
    res.status(500).json({ error: 'Error al crear cuenta contable' });
  }
};

// Actualizar cuenta contable
exports.updateCuenta = async (req, res) => {
  const { id } = req.params;
  try {
    const actualizada = await CuentasContables.update(id, req.body);
    res.json(actualizada);
  } catch (err) {
    console.error('Error al actualizar cuenta:', err);
    res.status(500).json({ error: 'Error al actualizar cuenta contable' });
  }
};

// Eliminar cuenta contable
exports.deleteCuenta = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await CuentasContables.delete(id);
    res.json(result);
  } catch (err) {
    console.error('Error al eliminar cuenta:', err);
    res.status(500).json({ error: 'Error al eliminar cuenta contable' });
  }
};
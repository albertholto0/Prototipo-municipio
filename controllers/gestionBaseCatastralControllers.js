const BaseCatastral = require('../models/gestionBaseCatastralModel');

const getAllBases = async (req, res) => {
  try {
    const registros = await BaseCatastral.getAll();
    res.json(registros);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener registros' });
  }
};

const getBaseById = async (req, res) => {
  try {
    const registro = await BaseCatastral.getById(req.params.id);
    if (!registro) return res.status(404).json({ message: 'No encontrado' });
    res.json(registro);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener registro' });
  }
};

const createBase = async (req, res) => {
  try {
    const nuevo = await BaseCatastral.create(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    console.error(err);
    if (err.code === 'DUPLICATE_ACCOUNT') {
      return res.status(400).json({ message: 'La clave catastral ya existe' });
    }
    res.status(500).json({ message: 'Error al crear registro' });
  }
};

const updateBase = async (req, res) => {
  try {
    const { cuenta } = req.body;
    const id = parseInt(req.params.id);

    // Obtener todas las bases (puedes optimizar si tienes método getByCuenta)
    const todas = await BaseCatastral.getAll();

    // Buscar si hay otra base con la misma cuenta, distinto ID
    const duplicada = todas.find(b => b.cuenta === cuenta && b.id_base_catastral !== id);

    if (duplicada) {
      return res.status(400).json({ message: 'Ya existe otra base con la misma clave catastral.' });
    }

    const actualizado = await BaseCatastral.update(id, req.body);
    res.json(actualizado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar registro' });
  }
};

const deleteBase = async (req, res) => {
  try {
    await BaseCatastral.delete(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar registro' });
  }
};

module.exports = {
  getAllBases,
  getBaseById,
  createBase,
  updateBase,
  deleteBase
};

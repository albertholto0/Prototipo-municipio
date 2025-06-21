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
    res.status(500).json({ message: 'Error al crear registro' });
  }
};

const updateBase = async (req, res) => {
  try {
    const actualizado = await BaseCatastral.update(req.params.id, req.body);
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

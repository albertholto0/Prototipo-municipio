const Cobrar = require('../models/cobrarModel');

module.exports = {
  getCuentas: async (req, res) => {
    const result = await Cobrar.getCuentas();
    res.json(result);
  },
  getSubcuentas: async (req, res) => {
    const result = await Cobrar.getSubcuentas(req.params.cuentaId);
    res.json(result);
  },
  getSecciones: async (req, res) => {
    const result = await Cobrar.getSecciones(req.params.subcuentaId);
    res.json(result);
  },
  getConceptos: async (req, res) => {
    const result = await Cobrar.getConceptos(req.params.seccionId);
    res.json(result);
  },
  getSubconceptos: async (req, res) => {
    const result = await Cobrar.getSubconceptos(req.params.conceptoId);
    res.json(result);
  },
};
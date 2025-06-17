const Cobrar = require('../models/cobrarModel');

class Cobrar {
    static async getContribuyente(req, res) {
        try {
            const contribuyentes = await Cobrar.getContribuyente();
            res.json(contribuyentes);
        } catch (error) {
            console.error('Error al obtener contribuyentes:', error);
            res.status(500).json({ message: 'Error al obtener contribuyentes' });
        }
    }

}

exports.getNormales = async (req, res) => {
  try {
    const normales = await EstimuloFiscal.getByTipo("normal");
    res.json(normales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Para adicionales
exports.getAdicionales = async (req, res) => {
  try {
    const adicionales = await EstimuloFiscal.getByTipo("adicional");
    res.json(adicionales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = CobrarController;
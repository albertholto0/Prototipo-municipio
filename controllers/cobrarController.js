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

module.exports = CobrarController;
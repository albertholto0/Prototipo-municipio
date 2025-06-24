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
  getConexiones: async (req, res) => {
    const result = await Cobrar.getConexiones(req.params.contribuyenteId);
    res.json(result);
  },
  getBaseCatastrales: async (req, res) => {
    const result = await Cobrar.getBaseCatastrales(req.params.contribuyenteId);
    res.json(result);
  },

  setRecibo: async (req, res) => {
    console.log('Datos recibidos:', req.body);
    try {
      const { folio, fecha, ejercicioFiscal, periodo, id_contribuyente, clave_cuentaContable, clave_subcuenta, clave_seccion, clave_concepto, clave_subconcepto, id_estimulo_fiscal, monto, monto_total_letras, descripcion, subtotal, forma_de_pago, id_base_catastral, id_establecimiento, id_conexion } = req.body;


      const recibo = await Cobrar.setRecibo(folio, fecha, ejercicioFiscal, periodo, id_contribuyente, clave_cuentaContable, clave_subcuenta, clave_seccion, clave_concepto, clave_subconcepto, id_estimulo_fiscal, monto, monto_total_letras, descripcion, subtotal, forma_de_pago, id_base_catastral, id_establecimiento, id_conexion);
      res.status(201).json({
        success: true,
        message: 'Recibo registrado exitosamente',
        recibo
      });
    } catch (error) {
      console.error('Error al registrar recibo:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }
};
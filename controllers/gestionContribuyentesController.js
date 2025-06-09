const Contribuyente = require('../models/gestionContribuyenteModel');
// Controlador para gestionar contribuyentes

exports.getAllContribuyentes = async (req, res) => {
  try {
    const contribuyentes = await Contribuyente.getAll();
    res.json(contribuyentes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.setContribuyente = async (req, res) => {
  try {
    const { nombre_completo,fecha_nacimiento, telefono, direccion, barrio, localidad, codigo_postal, rfc } = req.body;

    if (!nombre_completo || !telefono || !direccion || !barrio || !localidad || !codigo_postal || !rfc) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const contribuyenteId = await Contribuyente.setContribuyente(
      nombre_completo,
      fecha_nacimiento,
      telefono,
      direccion,
      barrio,
      localidad,
      codigo_postal,
      rfc
    );

    res.status(201).json({
      success: true,
      message: 'Contribuyente registrado exitosamente',
      contribuyenteId
    });

  } catch (error) {
    console.error('Error al registrar contribuyente:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor' 
    });
  }
};
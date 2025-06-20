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
    const { nombre, apellido_paterno, apellido_materno, fecha_nacimiento, rfc, calle, num_calle, barrio, localidad, codigo_postal, telefono } = req.body;

    if (!nombre || !apellido_paterno || !apellido_materno || !fecha_nacimiento ||  !telefono || !calle || !num_calle || !barrio || !localidad || !codigo_postal || !rfc) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const contribuyente = await Contribuyente.setContribuyente(
      nombre,
      apellido_paterno,
      apellido_materno,
      fecha_nacimiento,
      telefono,
      calle,
      num_calle,
      barrio,
      localidad,
      codigo_postal,
      rfc
    );

    res.status(201).json({
      success: true,
      message: 'Contribuyente registrado exitosamente',
      contribuyente
    });

  } catch (error) {
    console.error('Error al registrar contribuyente:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

exports.putContribuyente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido_paterno, apellido_materno, fecha_nacimiento, rfc, calle, num_calle, barrio, localidad, codigo_postal, telefono } = req.body;

    if (!nombre || !telefono || !calle || !barrio || !localidad || !codigo_postal || !rfc) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const actualizarContribuyente = await Contribuyente.putContribuyente(id,
      nombre,
      apellido_paterno,
      apellido_materno,
      fecha_nacimiento,
      telefono,
      calle,
      num_calle,
      barrio,
      localidad,
      codigo_postal,
      rfc
    );

    res.status(201).json({
      success: true,
      message: 'Contribuyente actualizado exitosamente',
      actualizarContribuyente
    });

  } catch (error) {
    console.error('Error al actualizar contribuyente:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
}

exports.deleteContribuyente = async (req, res) => {
  try {
    const { id } = req.params;
    await Contribuyente.deleteContribuyente(id);
    res.status(200).json({ success: true, message: 'Contribuyente eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al eliminar contribuyente' });
  }
};

exports.getContribuyenteById = async (req, res) => {
  try {
    const { id } = req.params;
    const contribuyente = await Contribuyente.getContribuyenteById(id);
    if (!contribuyente) {
      return res.status(404).json({ error: 'Contribuyente no encontrado' });
    }
    res.json(contribuyente);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
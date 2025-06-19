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
    const nombre_completo = `${nombre} ${apellido_paterno} ${apellido_materno}`.trim();
    const direccion = `${calle} ${num_calle}`.trim(); // Concatenar calle y número de calle

    if (!nombre_completo || !telefono || !direccion || !barrio || !localidad || !codigo_postal || !rfc) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const contribuyente = await Contribuyente.setContribuyente(
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
    const nombre_completo = `${nombre} ${apellido_paterno} ${apellido_materno}`.trim();
    const direccion = `${calle} ${num_calle}`.trim(); // Concatenar calle y número de calle

    if (!nombre_completo || !telefono || !direccion || !barrio || !localidad || !codigo_postal || !rfc) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const actualizarContribuyente = await Contribuyente.updateContribuyente(id,
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
const Establecimiento = require("../models/gestionEstablecimientoModel");

exports.getAllEstablecimientos = async (req, res) => {
  try {
    const establecimientos = await Establecimiento.getAll();
    res.json(establecimientos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createEstablecimiento = async (req, res) => {
  try {
    console.log("Datos recibidos:", req.body);
    // Validar que todos los campos requeridos estén presentes
    const {
      nombre_establecimiento,
      direccion,
      barrio,
      localidad,
      codigo_postal,
      fecha_apertura,
      giro_negocio,
      id_contribuyente,
    } = req.body;

    if (
      !nombre_establecimiento ||
      !direccion ||
      !barrio ||
      !localidad ||
      !codigo_postal ||
      !fecha_apertura ||
      !giro_negocio ||
      !id_contribuyente
    ) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios." });
    }

    const nuevoEstablecimiento = {
      nombre_establecimiento,
      direccion,
      barrio,
      localidad,
      codigo_postal,
      fecha_apertura,
      giro_negocio,
      id_contribuyente,
    };

    const resultado = await Establecimiento.create(nuevoEstablecimiento);
    res
      .status(201)
      .json({ message: "Establecimiento creado", id: resultado.insertId });
  } catch (error) {
    console.error("Error al insertar establecimiento:", error.message);
    console.error("Detalles completos:", error);
    console.error("Error al crear establecimiento:", error);
    res.status(500).json({ message: error.message });
  }
};

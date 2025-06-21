// filepath: /routes/gestionConfiguracionRoute.js
const express = require("express");
const Configuracion = require("../models/gestionConfiguracionModel");
const router = express.Router();

// Ruta para obtener todos los configuraciones
router.get("/", async (req, res) => {
  try {
    const configuracion = await Configuracion.getAll();
    res.json(configuracion);
  } catch (err) {
    console.error("Error al obtener establecimientos:", err);
    res.status(500).json({ error: "Error   al obtener establecimientos" });
  }
});

module.exports = router;

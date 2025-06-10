// filepath: /routes/gestionEstablecimientoRoute.js
const express = require("express");
const Establecimiento = require("../models/gestionEstablecimientoModel");
const router = express.Router();

// Ruta para obtener todos los establecimientos
router.get("/", async (req, res) => {
  try {
    const establecimientos = await Establecimiento.getAll();
    res.json(establecimientos);
  } catch (err) {
    console.error("Error al obtener establecimientos:", err);
    res.status(500).json({ error: "Error   al obtener establecimientos" });
  }
});

module.exports = router;

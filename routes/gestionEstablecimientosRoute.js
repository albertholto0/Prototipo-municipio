const express = require("express");
const router = express.Router();

const establecimientoController = require("../controllers/gestionEstablecimientosControllers");

// Asegúrate que ambas funciones estén exportadas en el controlador
router.get("/", establecimientoController.getAllEstablecimientos);
router.post("/", establecimientoController.createEstablecimiento);

module.exports = router;

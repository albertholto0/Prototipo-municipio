const express = require("express");
const router = express.Router();
const establecimientoController = require("../controllers/gestionEstablecimientosController");

// Obtener todos los establecimientos
router.get("/", establecimientoController.getAllEstablecimientos);

// Obtener un establecimiento por ID
router.get("/:id", establecimientoController.getEstablecimientoById);

// Registrar un nuevo establecimiento
router.post("/", establecimientoController.setEstablecimiento);

// Actualizar un establecimiento
router.put("/:id", establecimientoController.putEstablecimiento);

// Eliminar un establecimiento
router.delete("/:id", establecimientoController.deleteEstablecimiento);

module.exports = router;

const express = require("express");
const router = express.Router();
const Establecimiento = require("../controllers/gestionEstablecimientosControllers");

// Obtener todos los establecimientos
router.get("/", Establecimiento.getAll);

// Obtener un establecimiento por ID
router.get("/:id", Establecimiento.getEstablecimientoById);

// Registrar un nuevo establecimiento
router.post("/", Establecimiento.setEstablecimiento);

// Actualizar un establecimiento
router.put("/:id", Establecimiento.putEstablecimiento);

// Eliminar un establecimiento
router.delete("/:id", Establecimiento.deleteEstablecimiento);

module.exports = router;

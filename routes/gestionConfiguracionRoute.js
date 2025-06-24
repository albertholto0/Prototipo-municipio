const express = require("express");
const router = express.Router();
const multer = require("multer");
const configuracionController = require("../controllers/gestionConfiguracionController");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", configuracionController.getAllConfiguracion);
router.post(
  "/",
  upload.single("logo"),
  configuracionController.createConfiguracion
);
router.delete("/", configuracionController.resetConfiguracion);

module.exports = router;

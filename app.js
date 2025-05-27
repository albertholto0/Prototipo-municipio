const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const contribuyenteRoutes = require("./routes/gestionContribuyenteRoute");
const EstablecimientoRouter = require("./routes/gestionEstablecimientosRoute");
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use("/api/contribuyentes", contribuyenteRoutes);
app.use("/api/establecimientos", EstablecimientoRouter);
// Agregar más rutas para otros módulos

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

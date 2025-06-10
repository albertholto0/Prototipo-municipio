const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const contribuyenteRoutes = require("./routes/gestionContribuyenteRoute");
const EstablecimientoRouter = require("./routes/gestionEstablecimientosRoute");
const seccionesRoutes = require("./routes/gestionSeccionRoutes");
const cuentaContableRoutes = require('./routes/gestionCuentasContablesRoute');
const conexionRouter = require("./routes/gestionConexionRoute");
const usuariosRoutes = require("./routes/gestionUsuariosRoute");
const conceptoRoutes = require("./routes/gestionConceptoRoute");
const cobrar = require("./routes/cobrarRoute");
const subcuentas = require("./routes/gestionSubcuentasContablesRoute");
const subconceptos = require("./routes/gestionSubconceptoRoute");
const app = express();
const gestionEjerciccioFiscalRoute=require("./routes/gestionEjerciccioFiscalRoute");

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/contribuyentes", contribuyenteRoutes);
app.use("/api/establecimientos", EstablecimientoRouter);
app.use("/api/secciones", seccionesRoutes);
app.use("/api/cuentasContables", cuentaContableRoutes);
app.use("/api/conexion", conexionRouter);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/conceptos", conceptoRoutes);
<<<<<<< HEAD
app.use("/api/cobrar", cobrar);
app.use("/api/EjercicioFiscal",gestionEjerciccioFiscalRoute );
// Agregar más rutas para otros módulos
=======
app.use("/api/subcuentasContables", subcuentas);
app.use("/api/subconceptos", subconceptos);
// app.use("/api/cobrar", cobrar);
>>>>>>> ea0f48ad3b42b3b81d4d4a8b817b216d056a5195

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo anda mal!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

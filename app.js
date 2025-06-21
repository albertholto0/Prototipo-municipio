const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const baseCatastralRoutes = require('./routes/gestionBaseCatastralRoute');
const contribuyenteRoutes = require("./routes/gestionContribuyenteRoute");
const EstablecimientoRouter = require("./routes/gestionEstablecimientosRoute");
const seccionesRoutes = require("./routes/gestionSeccionRoutes");
const cuentaContableRoutes = require('./routes/gestionCuentasContablesRoute');
const conexionRouter = require("./routes/gestionConexionRoute");
const usuariosRoutes = require("./routes/gestionUsuariosRoute");
const conceptoRoutes = require("./routes/gestionConceptoRoute");
const estimuloFiscalRoutes = require("./routes/gestionEstimuloFiscalRoute");
const cobrar = require("./routes/cobrarRoute");
const subcuentas = require("./routes/gestionSubcuentasContablesRoute");
const corteCaja = require("./routes/gestionCorteCajaRoute");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/baseCatastral', baseCatastralRoutes);
app.use("/api/contribuyentes", contribuyenteRoutes);
app.use("/api/establecimientos", EstablecimientoRouter);
app.use("/api/secciones", seccionesRoutes);
app.use("/api/cuentasContables", cuentaContableRoutes);
app.use("/api/conexion", conexionRouter);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/conceptos", conceptoRoutes);
app.use("/api/estimuloFiscal", estimuloFiscalRoutes);
app.use("/api/subcuentasContables", subcuentas);
app.use("/api/subconceptos", subconceptos);
app.use("/api/cobrar", cobrar);
app.use("/api/corteCaja", corteCajaRouter);
app.use("/api/cobrar", cobrar);


app.get("/", (req, res) => {
  res.send("API funcionando correctamente");
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo anda mal!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

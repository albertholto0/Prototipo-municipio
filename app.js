const express = require("express");
const session = require('express-session');
const bodyParser = require("body-parser");
const cors = require("cors");
const baseCatastralRoutes = require('./routes/gestionBaseCatastralRoute');
const contribuyenteRoutes = require("./routes/gestionContribuyenteRoute");
const establecimientoRoutes = require("./routes/gestionEstablecimientosRoute");
const seccionesRoutes = require("./routes/gestionSeccionRoutes");
const cuentaContableRoutes = require("./routes/gestionCuentasContablesRoute");
const conexionRoutes = require("./routes/gestionConexionRoute");
const usuariosRoutes = require("./routes/gestionUsuariosRoute");
const conceptoRoutes = require("./routes/gestionConceptoRoute");
const configuracionRoutes = require("./routes/gestionConfiguracionRoute");
const estimuloFiscalRoutes = require("./routes/gestionEstimuloFiscalRoute");
const corteCajaRoutes = require("./routes/gestionCorteCajaRoute");
const cobrarRoutes = require("./routes/cobrarRoute");
const subcuentasRoutes = require("./routes/gestionSubcuentasContablesRoute");
const subconceptoRoutes = require("./routes/gestionSubconceptoRoute");
const alquilerRoutes = require("./routes/gestionAlquilerRoute");
const ejercicioFiscalRoutes = require("./routes/gestionEjercicioFiscalRoute");
const inicioSesionRoutes = require("./routes/inicioSesionRoute");
const historialAccesosRoutes = require("./routes/gestionHistorialAccesosRoute");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({
  secret: 'abc',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Rutas
app.use('/api/baseCatastral', baseCatastralRoutes);
app.use("/api/contribuyentes", contribuyenteRoutes);
app.use("/api/establecimientos", establecimientoRoutes);
app.use("/api/secciones", seccionesRoutes);
app.use("/api/cuentasContables", cuentaContableRoutes);
app.use("/api/conexion", conexionRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/conceptos", conceptoRoutes);
app.use("/api/configuracion", configuracionRoutes);
app.use("/api/estimulosFiscales", estimuloFiscalRoutes);
app.use("/api/corteCaja", corteCajaRoutes);
app.use("/api/cobrar", cobrarRoutes);
app.use("/api/subcuentasContables", subcuentasRoutes);
app.use("/api/subconceptos", subconceptoRoutes);
app.use("/api/alquileres", alquilerRoutes);
app.use("/api/EjercicioFiscal", ejercicioFiscalRoutes);
app.use("/api/inicioSesion", inicioSesionRoutes);
app.use("/api/historialAccesos", historialAccesosRoutes);

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

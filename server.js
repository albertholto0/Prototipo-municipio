const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors'); // Añade esto

const app = express();
const PORT = 3000;

// Configuración de MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'bd_municipio'
});

// Conexión a MySQL
db.connect(err => {
  if (err) {
    console.error('Error conectando a MySQL:', err);
    return;
  }
  console.log('Conectado a MySQL con éxito');
});

// Middlewares importantes
app.use(cors()); // Habilita CORS
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para obtener contribuyentes
app.get('/api/contribuyentes', (req, res) => {
  const query = `
    SELECT 
      nombre_completo,
      rfc,
      calle,
      numero_vivienda,
      barrio,
      fecha_nacimiento,
      tipo_contribuyente
    FROM contribuyentes
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).json({ 
        error: 'Error al obtener contribuyentes',
        detalles: err.message 
      });
    }
    res.json(results);
  });
});

// Ruta para servir tu HTML principal
app.get('/gestion-contribuyentes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'GestionContribuyentes', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = 3000;

// Configuración de MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'bd_municipio'
});

// Conectar a MySQL
db.connect(err => {
  if (err) {
    console.error('Error conectando a MySQL:', err);
    return;
  }
  console.log('Conectado a MySQL');
});

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para obtener datos JSON de contribuyentes
app.get('/api/contribuyentes', (req, res) => {
  const query = 'SELECT * FROM contribuyentes';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).json({ error: 'Error al obtener contribuyentes' });
    }
    res.json(results);
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
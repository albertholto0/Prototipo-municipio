const mysql = require('mysql2');
require('dotenv').config();

// Configuración de MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'db_municipio'
});

// Conexión a MySQL
db.connect(err => {
  if (err) {
    console.error('Error conectando a MySQL:', err);
    return;
  }
  console.log('Conectado a MySQL con éxito');
});

// module.exports = pool.promise(); // Usamos promises en lugar de callbacks
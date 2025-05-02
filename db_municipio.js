// Importar el módulo mysql2
const mysql = require('mysql2/promise');

// Configuración de la conexión
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'bd_municipio',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
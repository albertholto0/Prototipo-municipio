// filepath: /home/rafaeldiaz/Documentos/Sexto Semestre/Ingenieria de Software II/Prototipo-municipio/config/database.js
const mysql = require("mysql2/promise");
require("dotenv").config();

// Configuración de MySQL con soporte para promesas
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'db_municipio',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;

const express = require('express');
const pool = require('./db_municipio'); // Importas la conexión

const app = express();
app.use(express.json());

// Ruta de ejemplo: Obtener todos los recibos
app.get('/recibos', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM recibos');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
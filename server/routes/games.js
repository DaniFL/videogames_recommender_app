// routes/games.js
const express = require('express');
const router = express.Router();
const { poolPromise } = require('../config/db');

// Definimos una ruta GET en /search que acepta un parámetro de consulta 'query'
// Ejemplo de llamada desde el frontend: /api/games/search?query=cyber
router.get('/search', async (req, res) => {
    const { query } = req.query;

    // Si la consulta está vacía o es muy corta, devolvemos un array vacío para no sobrecargar la DB.
    if (!query || query.length < 2) {
        return res.json([]);
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            // El comodín '%' busca cualquier texto que CONTENGA el término de búsqueda.
            .input('searchTerm', `%${query}%`)
            // Usamos TOP 7 para limitar el número de sugerencias y que la respuesta sea rápida.
            .query('SELECT TOP 7 name FROM Videojuegos WHERE name LIKE @searchTerm');

        res.json(result.recordset);

    } catch (error) {
        console.error("Error al buscar videojuegos:", error);
        res.status(500).json({ message: "Error interno al buscar juegos." });
    }
});

module.exports = router;
// routes/recommendations.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const { poolPromise } = require('../config/db');
const { authenticateToken } = require('./user');

router.post('/', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { positiveGames } = req.body;

    if (!positiveGames || positiveGames.length === 0) {
        return res.status(400).json({ message: 'Faltan datos necesarios (positiveGames).' });
    }

    const recommenderApiUrl = process.env.RECOMMENDER_API_URL;

    try {
        // --- Paso 1: Obtener las recomendaciones básicas (nombre y score) de la API de Python ---
        console.log(`[Backend] Llamando a la API de Python para el usuario ${userId}`);
        const pythonApiResponse = await axios.post(`${recommenderApiUrl}/recommend`, {
            user_id: userId,
            positive_games: positiveGames,
            n: 12
        });
        
        const basicRecommendations = pythonApiResponse.data; // Ej: [{ "Portal 2": 0.98 }, { "Half-Life 2": 0.95 }]

        if (!basicRecommendations || basicRecommendations.length === 0) {
            return res.status(200).json([]);
        }

        // --- Paso 2: Extraer los nombres de los juegos para consultar nuestra base de datos ---
        const gameNames = basicRecommendations.map(rec => Object.keys(rec)[0]);

        // --- Paso 3: Consultar nuestra tabla Videojuegos para obtener los detalles ---
        const pool = await poolPromise;
        // Creamos una consulta parametrizada segura para evitar inyección SQL
        const placeholders = gameNames.map((_, i) => `@name${i}`).join(',');
        const request = pool.request();
        gameNames.forEach((name, i) => {
            request.input(`name${i}`, name);
        });
        
        const dbResult = await request.query(
            `SELECT name, genres, categories, header_image, link FROM Videojuegos WHERE name IN (${placeholders})`
        );
        
        // Creamos un mapa para buscar detalles de forma eficiente: { "Portal 2": { ...detalles } }
        const gameDetailsMap = new Map(dbResult.recordset.map(game => [game.name, game]));
        
        // --- Paso 4: Unir los resultados y enviar la respuesta enriquecida ---
        const enrichedRecommendations = basicRecommendations.map(rec => {
            const name = Object.keys(rec)[0];
            const score = rec[name];
            const details = gameDetailsMap.get(name);

            return {
                name,
                score,
                ...details // Añadimos todos los detalles de la base de datos
            };
        }).filter(rec => rec.header_image); // Nos aseguramos de que solo devolvemos juegos con detalles

        res.status(200).json(enrichedRecommendations);

    } catch (error) {
        console.error('[Backend] Error al generar recomendaciones enriquecidas:', error.message);
        res.status(500).json({ message: 'Error al generar las recomendaciones.' });
    }
});

module.exports = router;
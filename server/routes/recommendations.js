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
        const pythonApiResponse = await axios.post(`${recommenderApiUrl}/recommend/`, {
            user_id: userId,
            game_titles: positiveGames,
            k: 12
        });
        
        const gameNames = pythonApiResponse.data.recommendations;

        if (!gameNames || gameNames.length === 0) {
            return res.status(200).json([]);
        }

        const pool = await poolPromise;
        const placeholders = gameNames.map((_, i) => `@name${i}`).join(',');
        const request = pool.request();
        gameNames.forEach((name, i) => {
            request.input(`name${i}`, name);
        });
        
        
        const dbResult = await request.query(
            `SELECT appid, name, genres, categories, header_image, platforms FROM Videojuegos WHERE name IN (${placeholders})`
        );
        
        const gameDetailsMap = new Map(dbResult.recordset.map(game => [game.name, game]));
        
        const enrichedRecommendations = gameNames.map(gameName => {
            const details = gameDetailsMap.get(gameName);
            
            if (!details || !details.appid) { 
                return null;
            }

            const link = `https://steamcommunity.com/app/${details.appid}`;

            
            return {
                ...details,
                link: link 
            };
        }).filter(rec => rec && rec.header_image);

        res.status(200).json(enrichedRecommendations);

    } catch (error) {
        console.error('[Backend] Error al generar recomendaciones enriquecidas:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Error al generar las recomendaciones.' });
    }
});

module.exports = router;
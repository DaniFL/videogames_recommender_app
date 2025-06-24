// routes/recommendations.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
// Importamos solo la función de autenticación desde user.js
const { authenticateToken } = require('./user');

// ¡CAMBIO CLAVE! Añadimos el middleware 'authenticateToken' para proteger la ruta
router.post('/', authenticateToken, async (req, res) => {
    
    // ¡CAMBIO CLAVE! Obtenemos el userId del token (seguro) en lugar del body
    const userId = req.user.id; 
    const { positiveGames } = req.body; // Solo necesitamos los juegos del body

    if (!positiveGames || positiveGames.length === 0) {
        return res.status(400).json({ message: 'Faltan datos necesarios (positiveGames).' });
    }
    const recommenderApiUrl = process.env.RECOMMENDER_API_URL;
    try {
        console.log(`[Backend] Llamando a la API de Python para el usuario ${userId}`);
        const apiResponse = await axios.post(`${recommenderApiUrl}/recommend`, {
            user_id: userId,
            positive_games: positiveGames,
            n: 12
        });
        res.status(200).json(apiResponse.data);
    } catch (error) {
        console.error('[Backend] Error al contactar la API de Python:', error.message);
        res.status(500).json({ message: 'Error al generar las recomendaciones.' });
    }
});

module.exports = router;
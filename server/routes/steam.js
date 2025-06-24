// routes/steam.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Endpoint para obtener las categorías destacadas de Steam
const STEAM_API_URL = 'https://store.steampowered.com/api/featuredcategories/';

router.get('/featured-categories', async (req, res) => {
    try {
        console.log('[Backend] Petición recibida. Llamando a la API de Steam...');
        const response = await axios.get(STEAM_API_URL);
        
        // Enviamos la respuesta de Steam directamente al frontend
        res.status(200).json(response.data);

    } catch (error) {
        console.error('[Backend] Error al contactar la API de Steam:', error.message);
        res.status(502).json({ message: 'No se pudo obtener la información de Steam.' });
    }
});

module.exports = router;
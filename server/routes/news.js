// routes/news.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
    const NEWS_API_KEY = process.env.NEWS_API_KEY;

    if (!NEWS_API_KEY) {
        return res.status(500).json({ message: 'La clave de la API de noticias no está configurada en el servidor.' });
    }

    // Calculamos la fecha de "hace un mes" para obtener noticias recientes
    const date = new Date();
    date.setDate(date.getDate() - 30); // Noticias de los últimos 30 días
    const fromDate = date.toISOString().split('T')[0]; // Formato YYYY-MM-DD

    const apiUrl = `https://newsapi.org/v2/everything?` +
                   `q=(game OR videojuego OR Steam OR PlayStation OR Xbox OR Nintendo) NOT (cripto OR crypto)` +
                   `&from=${fromDate}` +
                   `&sortBy=popularity` +
                   `&language=es` +
                   `&apiKey=${NEWS_API_KEY}`;

    try {
        console.log('[Backend] Petición recibida. Llamando a la News API...');
        const response = await axios.get(apiUrl);

        // Filtramos artículos que no tengan imagen o título para mejorar la calidad
        const filteredArticles = response.data.articles.filter(
            article => article.urlToImage && article.title && article.description
        );

        res.status(200).json({ articles: filteredArticles });

    } catch (error) {
        console.error('[Backend] Error al contactar la News API:', error.response?.data || error.message);
        res.status(502).json({ message: 'No se pudo obtener la información de las noticias.' });
    }
});

module.exports = router;
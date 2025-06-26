// routes/admin.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const { poolPromise } = require('../config/db');
const { authenticateToken, isAdmin } = require('./user');

// ¡CLAVE! Aplicamos ambos middlewares a TODAS las rutas de este archivo.
// Primero verifica que el usuario esté logueado, luego que sea admin.
router.use(authenticateToken, isAdmin);

// --- Endpoint para "Analizar Datos" (Estadísticas Generales) ---
router.get('/stats/overview', async (req, res) => {
    try {
        const pool = await poolPromise;
        const totalUsers = await pool.request().query('SELECT COUNT(*) as total FROM Usuarios');
        const totalGamesResult = await pool.request().query('SELECT COUNT(*) as total FROM Videojuegos');
        // const totalReviews = await pool.request().query('SELECT COUNT(*) as total FROM Reviews');
        const visitorsTodayResult = await pool.request().query(
            "SELECT COUNT(DISTINCT id) as today FROM Usuarios WHERE CAST(lastLoginAt AS DATE) = CAST(GETDATE() AS DATE)"
        );

        res.json({
            totalUsers: totalUsers.recordset[0].total,
            totalGames: totalGamesResult.recordset[0].total,
            // totalReviews: totalReviews.recordset[0].total
            visitorsToday: visitorsTodayResult.recordset[0].today
        });
    } catch (error) {
        console.error("Error al obtener estadísticas:", error);
        res.status(500).json({ message: 'Error al obtener estadísticas.' });
    }
});

// --- Endpoint para "Visualizar Actividad Usuarios" (Gráficos) ---
router.get('/stats/user-activity', async (req, res) => {
    try {
        const pool = await poolPromise;
        // Usuarios registrados por día (últimos 30 días)
        const registrations = await pool.request().query(
            "SELECT CAST(createdAt AS DATE) as date, COUNT(*) as count FROM Usuarios WHERE createdAt >= DATEADD(day, -30, GETDATE()) GROUP BY CAST(createdAt AS DATE) ORDER BY date"
        );
        // Inicios de sesión por día (últimos 30 días)
        const logins = await pool.request().query(
            "SELECT CAST(lastLoginAt AS DATE) as date, COUNT(*) as count FROM Usuarios WHERE lastLoginAt >= DATEADD(day, -30, GETDATE()) GROUP BY CAST(lastLoginAt AS DATE) ORDER BY date"
        );

        res.json({
            registrations: registrations.recordset,
            logins: logins.recordset
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener actividad de usuarios.' });
    }
});

// --- Endpoints para "Bloquear Usuarios" ---
// Asumo que tienes una columna 'isBlocked' (booleana) en tu tabla 'Usuarios'

// Obtener todos los usuarios
router.get('/users', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT id, username, email, createdAt, isBlocked FROM Usuarios');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la lista de usuarios.' });
    }
});

// Bloquear/Desbloquear un usuario
router.put('/users/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { isBlocked } = req.body; // El frontend enviará true o false
        const pool = await poolPromise;
        await pool.request()
            .input('userId', id)
            .input('isBlocked', isBlocked)
            .query('UPDATE Usuarios SET isBlocked = @isBlocked WHERE id = @userId');

        res.json({ message: `Usuario ${isBlocked ? 'bloqueado' : 'desbloqueado'} correctamente.` });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el estado del usuario.' });
    }
});

// --- Endpoint para "Verificar Estado de APIs Externas" ---
router.get('/health-check', async (req, res) => {
    const recommenderApiUrl = process.env.RECOMMENDER_API_URL;
    const newsApiKey = process.env.NEWS_API_KEY;

    const statuses = [];
    const axiosConfig = {
        timeout: 5000,
    };

    // 1. Verificar la API de Recomendación
    try {
        await axios.get(recommenderApiUrl, axiosConfig);
        statuses.push({ name: 'API del Modelo de Recomendación', status: 'Online' });
    } catch (error) {
        console.error("Error detallado al verificar la API de Recomendación:", error);
        statuses.push({ 
            name: 'API del Modelo de Recomendación', 
            status: 'Offline', 
            error: error.code || error.message
        });
    }

    // 2. Verificar la API de Noticias
    try {
        const newsApiUrl = `https://newsapi.org/v2/everything?q=test&pageSize=1&apiKey=${newsApiKey}`;
        await axios.get(newsApiUrl, axiosConfig);
        statuses.push({ name: 'API de Noticias (newsapi.org)', status: 'Online' });
    } catch (error) {
        console.error("Error detallado al verificar la API de Noticias:", error);
        statuses.push({ 
            name: 'API de Noticias (newsapi.org)', 
            status: 'Offline', 
            error: error.code || error.response?.data?.message || error.message
        });
    }

    res.json(statuses);
});

module.exports = router;
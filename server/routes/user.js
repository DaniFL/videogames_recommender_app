const express = require('express');
const router = express.Router();
const { poolPromise } = require('../config/db');
const jwt = require('jsonwebtoken');

// Ruta para obtener los datos del usuario
router.get('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Extraer el token del encabezado de autorización

        if (!token) {
            return res.status(400).json({ message: 'Token es requerido' });
        }

        // Decodificar el token para extraer el userId
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        if (!userId) {
            return res.status(400).json({ message: 'userId no encontrado en el token' });
        }

        const pool = await poolPromise;
        const result = await pool.request()
            .input('userId', userId)
            .query('SELECT username, email FROM Usuarios WHERE id = @userId');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;

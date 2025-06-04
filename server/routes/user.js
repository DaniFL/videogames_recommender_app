const express = require('express');
const router = express.Router();
const { poolPromise } = require('../config/db');
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token es requerido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.userId };
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido' });
    }
};

// Ruta para obtener los datos del usuario
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const pool = await poolPromise;
        const result = await pool.request()
            .input('userId', userId)
            .query('SELECT username, email, avatar FROM Usuarios WHERE id = @userId');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ruta para actualizar los datos del usuario
router.put('/profile', authenticateToken, async (req, res) => {
    const { username, email, avatar } = req.body;

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('userId', req.user.id) // Suponiendo que el ID del usuario está en req.user
            .input('username', username)
            .input('email', email)
            .input('avatar', avatar)
            .query('UPDATE Usuarios SET username = @username, email = @email, avatar = @avatar WHERE id = @userId');

        res.json({ message: 'Perfil actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar el perfil del usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;

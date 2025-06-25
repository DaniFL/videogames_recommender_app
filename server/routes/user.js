// routes/user.js
const express = require('express');
const router = express.Router();
const { poolPromise } = require('../config/db');
const jwt = require('jsonwebtoken');

// Definimos el middleware de autenticación
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; // Leemos el token de la cookie

    if (!token) {
        return res.status(401).json({ message: 'No autenticado: falta el token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.userId }; // Guardamos el id del usuario en el objeto request
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido o expirado' });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        const userId = req.user.id; // Obtenemos el ID del middleware anterior
        const pool = await poolPromise;
        const result = await pool.request()
            .input('userId', userId)
            .query('SELECT admin FROM Usuarios WHERE id = @userId');

        if (result.recordset.length > 0 && result.recordset[0].admin === true) {
            next(); // El usuario es admin, puede continuar
        } else {
            // El usuario no es admin o no se encontró
            return res.status(403).json({ message: 'Acceso denegado: se requieren permisos de administrador.' });
        }
    } catch (error) {
        console.error("Error en el middleware isAdmin:", error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// Ruta para obtener los datos del usuario
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const pool = await poolPromise;
        const result = await pool.request()
            .input('userId', userId)
            .query('SELECT id, username, email, avatar, admin FROM Usuarios WHERE id = @userId');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Enviamos el objeto completo
        res.json(result.recordset[0]);
        
    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ruta para actualizar los datos del usuario
router.put('/profile', authenticateToken, async (req, res) => {
    const { username, email, avatar } = req.body;
    const userId = req.user.id;

    if (!username || !email) {
        return res.status(400).json({ message: 'El nombre de usuario y el email son obligatorios.' });
    }

    try {
        const pool = await poolPromise;
        // Primero, actualizamos la base de datos
        await pool.request()
            .input('userId', userId)
            .input('username', username)
            .input('email', email)
            .input('avatar', avatar)
            .query('UPDATE Usuarios SET username = @username, email = @email, avatar = @avatar WHERE id = @userId');

        // ¡CAMBIO CLAVE! Después de actualizar, volvemos a solicitar los datos frescos
        const updatedUserResult = await pool.request()
            .input('userId', userId)
            .query('SELECT id, username, email, avatar FROM Usuarios WHERE id = @userId');
        
        // Devolvemos el objeto de usuario actualizado al frontend
        res.status(200).json(updatedUserResult.recordset[0]);

    } catch (error) {
        console.error('Error al actualizar el perfil del usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = {
    router: router,
    authenticateToken: authenticateToken,
    isAdmin: isAdmin
};
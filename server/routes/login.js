// routes/login.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { poolPromise } = require('../config/db');
const router = express.Router();
const tableName = process.env.DB_TABLE;

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Faltan datos' });
    }

    try {
        const pool = await poolPromise;
        const userCheck = await pool.request()
            .input('email', email)
            .query(`SELECT * FROM ${tableName} WHERE email = @email`);

        if (userCheck.recordset.length === 0) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const user = userCheck.recordset[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

         // Justo después de validar al usuario, actualizamos su fecha de último login
        const updateLoginDate = pool.request()
            .input('userId', user.id)
            .query('UPDATE Usuarios SET lastLoginAt = GETDATE() WHERE id = @userId');

        // 1. Generamos el token 
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
            maxAge: 24 * 60 * 60 * 1000
        });
        
        // Esperamos a que la actualización de la fecha termine (no es estrictamente necesario y luego enviamos la respuesta.
        await updateLoginDate;
        
        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            user: {
                id: user.id,
                username: user.username,
                avatar: user.avatar,
                email: user.email,
                admin: user.admin
            }
        });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;
const express = require('express');
const bcrypt = require('bcrypt');
const { poolPromise } = require('../config/db');
const router = express.Router();
const tableName = process.env.DB_TABLE;

/* Método GET para renderizar la página de registro
router.get('/', (req, res) => {
    res.send('Página de registro');
});
*/

// Ruta para registrar usuarios
router.post('/', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Faltan datos' });
    }

    try {
        const pool = await poolPromise;
        const userCheck = await pool.request()
            .input('email', email)
            .query(`SELECT * FROM ${tableName} WHERE email = @email`);

        if (userCheck.recordset.length > 0) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.request()
            .input('username', username)
            .input('email', email)
            .input('password', hashedPassword)
            .query(`INSERT INTO ${tableName} (username, email, password) VALUES (@username, @email, @password)`);

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Ruta para verificar si el nombre de usuario está disponible
router.post('/check-username', async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ message: 'Falta el nombre de usuario' });
    }

    try {
        const pool = await poolPromise;
        const userCheck = await pool.request()
            .input('username', username)
            .query(`SELECT * FROM ${tableName} WHERE username = @username`);

        const isAvailable = userCheck.recordset.length === 0;
        res.json({ available: isAvailable });
    } catch (error) {
        console.error('Error al verificar el nombre de usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;
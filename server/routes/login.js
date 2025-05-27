const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { poolPromise } = require('../config/db');
const router = express.Router();
const tableName = process.env.DB_TABLE;

/* Método GET para renderizar la página de inicio de sesión
router.get('/', (req, res) => {
    res.send('Página de inicio de sesión');
});
*/

// Ruta para iniciar sesión
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

        const token = jwt.sign({ userId: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

// Método GET para renderizar la página de registro
router.get('/', (req, res) => {
    res.send('Página de registro');
});

// Ruta para registrar usuarios
router.post('/', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Faltan datos' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        // Aquí guardarías el usuario en la base de datos (simulado)
        res.status(201).json({ message: 'Usuario registrado', username });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
});

module.exports = router;
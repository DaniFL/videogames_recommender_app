const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Método GET para renderizar la página de inicio de sesión
router.get('/', (req, res) => {
    res.send('Página de inicio de sesión');
});

// Ruta para iniciar sesión
router.post('/', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Faltan datos' });
    }

    try {
        // Aquí buscarías el usuario en la base de datos (simulado)
        const user = { username, password: '$2b$10$examplehashedpassword' }; // Contraseña simulada

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const token = jwt.sign({ username: user.username }, 'secret_key', { expiresIn: '1h' });
        res.json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
});

module.exports = router;
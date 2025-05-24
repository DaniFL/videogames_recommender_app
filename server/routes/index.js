const express = require('express');
const router = express.Router();

// Ruta de ejemplo
router.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});

// Ruta para la pantalla de inicio
router.get('/home', (req, res) => {
    res.send('Bienvenido a la pantalla de inicio');
});

module.exports = router;
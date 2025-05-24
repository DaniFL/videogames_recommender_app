const express = require('express');
const router = express.Router();

// Ruta de ejemplo
router.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});

module.exports = router;
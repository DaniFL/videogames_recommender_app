const express = require('express');
const router = express.Router();
const { poolPromise } = require('../config/db');

// Ruta de ejemplo
router.get('/', (req, res) => {
    res.send('Noticias');
});

module.exports = router;
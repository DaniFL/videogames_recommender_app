// routes/logout.js
const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    // Limpiamos la cookie 'token'. El navegador la eliminará.
    res.clearCookie('token');
    res.status(200).json({ message: 'Sesión cerrada correctamente' });
});

module.exports = router;
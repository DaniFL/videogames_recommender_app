// routes/register.js
const express = require('express');
const bcrypt = require('bcrypt');
const { poolPromise } = require('../config/db');
const router = express.Router();
const { body, validationResult } = require('express-validator'); 

const tableName = process.env.DB_TABLE || 'Usuarios';

// Añadimos el middleware de validación a la ruta POST
router.post('/',
    [
        // Reglas de validación
        body('email', 'Por favor, introduce un email válido').isEmail().normalizeEmail(),
        body('username', 'El nombre de usuario no puede estar vacío').notEmpty().trim().escape(),
        
        // --- INICIO DE LA CORRECCIÓN ---
        // Se han añadido validaciones específicas para la contraseña
        body('password', 'La contraseña no cumple con los requisitos.')
            .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.')
            .matches(/\d/).withMessage('La contraseña debe contener al menos un número.')
            .matches(/[a-z]/).withMessage('La contraseña debe contener al menos una letra minúscula.')
            .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una letra mayúscula.')
            .matches(/[@$!%*?&]/).withMessage('La contraseña debe contener al menos un símbolo: @$!%*?&')
        // --- FIN DE LA CORRECCIÓN ---
    ],
    async (req, res) => {
        // Comprobamos si hay errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Si hay errores, los devolvemos al frontend
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password, avatar } = req.body;

        try {
            const pool = await poolPromise;
            const userCheck = await pool.request()
                .input('email', email)
                .query(`SELECT * FROM ${tableName} WHERE email = @email`);

            if (userCheck.recordset.length > 0) {
                return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await pool.request()
                .input('username', username)
                .input('email', email)
                .input('password', hashedPassword)
                .input('avatar', avatar)
                .query(`INSERT INTO ${tableName} (username, email, password, avatar) VALUES (@username, @email, @password, @avatar)`);

            res.status(201).json({ message: 'Usuario registrado correctamente' });

        } catch (error) {
            console.error('Error al registrar usuario:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
);

module.exports = router;
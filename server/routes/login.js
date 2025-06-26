// routes/login.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { poolPromise } = require('../config/db');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const tableName = process.env.DB_TABLE || 'Usuarios';

router.post('/',
    [
        body('email', 'El campo de email no puede estar vacío').notEmpty(),
        body('password', 'El campo de contraseña no puede estar vacío').notEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        
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
            
            console.log(`[Backend] Usuario ${user.username} validado. Actualizando lastLoginAt...`);
            await pool.request()
                .input('userId', user.id)
                .query('UPDATE Usuarios SET lastLoginAt = GETDATE() WHERE id = @userId');
            console.log(`[Backend] lastLoginAt actualizado para el usuario ${user.id}`);
            // --- FIN DE LA CORRECCIÓN ---

            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                path: '/',
                maxAge: 24 * 60 * 60 * 1000
            });
            
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
    }
);

module.exports = router;
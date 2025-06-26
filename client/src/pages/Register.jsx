// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api'; // Usamos nuestro cliente de API centralizado

// --- Iconos para mejorar la interfaz ---
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const ErrorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;


const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        avatar: '/img/avatar/avatar1.jpg' // Un avatar por defecto
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username) newErrors.username = 'El nombre de usuario es obligatorio.';
        if (!formData.email) {
            newErrors.email = 'El email es obligatorio.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El formato del email no es válido.';
        }
        if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria.';
        } else if (formData.password.length < 8) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres.';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden.';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        if (!validateForm()) return;

        try {
            const response = await api.post('/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                avatar: formData.avatar
            });

            if (response.status === 201) {
                alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
                navigate('/login');
            }
        } catch (err) {
            const message = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Ocurrió un error en el registro.';
            setServerError(message);
        }
    };

    return (
        <section className="fixed inset-0 min-h-screen min-w-full flex items-stretch text-white">
            <div className="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0" style={{ backgroundColor: '#161616' }}>
                <div className="w-full py-6 z-20">
                    <h1 className="my-6 text-4xl font-bold text-indigo-500">Crear Cuenta</h1>
                    <form onSubmit={handleSubmit} className="sm:w-2/3 w-full px-4 lg:px-0 mx-auto" noValidate>
                        
                        {/* Campo Username */}
                        <div className="py-2">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4"><UserIcon /></span>
                                <input type="text" name="username" placeholder="Nombre de Usuario" onChange={handleChange} className="block w-full p-4 pl-12 text-lg rounded-lg bg-black border-2 border-transparent focus:border-indigo-500 focus:outline-none transition-colors" />
                            </div>
                            {errors.username && <p className="flex items-center text-red-400 text-xs mt-2 text-left px-2"><ErrorIcon />{errors.username}</p>}
                        </div>

                        {/* Campo Email */}
                        <div className="py-2">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4"><MailIcon /></span>
                                <input type="email" name="email" placeholder="Correo Electrónico" onChange={handleChange} className="block w-full p-4 pl-12 text-lg rounded-lg bg-black border-2 border-transparent focus:border-indigo-500 focus:outline-none transition-colors" />
                            </div>
                            {errors.email && <p className="flex items-center text-red-400 text-xs mt-2 text-left px-2"><ErrorIcon />{errors.email}</p>}
                        </div>

                        {/* Campo Contraseña */}
                        <div className="py-2">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4"><LockIcon /></span>
                                <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} className="block w-full p-4 pl-12 text-lg rounded-lg bg-black border-2 border-transparent focus:border-indigo-500 focus:outline-none transition-colors" />
                            </div>
                            <p className="text-gray-500 text-xs mt-2 text-left px-2">Debe contener al menos 8 caracteres, letras, números y un símbolo.</p>
                            {errors.password && <p className="flex items-center text-red-400 text-xs mt-1 text-left px-2"><ErrorIcon />{errors.password}</p>}
                        </div>

                        {/* Campo Confirmar Contraseña */}
                        <div className="py-2">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4"><LockIcon /></span>
                                <input type="password" name="confirmPassword" placeholder="Confirmar Contraseña" onChange={handleChange} className="block w-full p-4 pl-12 text-lg rounded-lg bg-black border-2 border-transparent focus:border-indigo-500 focus:outline-none transition-colors" />
                            </div>
                            {errors.confirmPassword && <p className="flex items-center text-red-400 text-xs mt-2 text-left px-2"><ErrorIcon />{errors.confirmPassword}</p>}
                        </div>

                        {serverError && <div className="text-red-400 p-3 mt-4 text-sm bg-red-900 bg-opacity-30 rounded-lg flex items-center justify-center"><ErrorIcon />{serverError}</div>}
                        
                        <div className="px-4 pb-2 pt-6">
                            <button type="submit" className="uppercase block w-full p-4 text-lg rounded-full bg-indigo-500 hover:bg-indigo-600 focus:outline-none transform hover:scale-105 transition-transform duration-300 shadow-lg shadow-indigo-500/20">
                                Registrarse
                            </button>
                        </div>
                    </form>
                    <p className="mt-4 text-sm text-gray-400">¿Ya tienes una cuenta?{' '}<Link to="/login" className="text-indigo-500 hover:underline">Inicia sesión</Link></p>
                </div>
            </div>
            <div className="lg:flex w-1/2 hidden bg-gray-500 bg-no-repeat bg-cover relative items-center" style={{ backgroundImage: `url(${import.meta.env.VITE_IMAGE_REGISTER})` }}>
                <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
                <div className="w-full px-24 z-10">
                    <h1 className="text-5xl font-bold text-left tracking-wide">Únete a la Comunidad</h1>
                    <p className="text-3xl my-4">Encuentra tu próximo juego favorito.</p>
                </div>
            </div>
        </section>
    );
};

export default Register;
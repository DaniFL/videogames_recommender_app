// src/pages/Login.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

// --- Iconos reutilizados ---
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const ErrorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Ambos campos son obligatorios.');
            return;
        }
        setError('');

        try {
            await login(email, password);
            navigate('/user-home');
        } catch (err) {
            setError('Email o contraseña incorrectos.');
            console.error('Error de inicio de sesión:', err);
        }
    };

    return (
        <section className="fixed inset-0 min-h-screen min-w-full flex items-stretch text-white">
            <div className="lg:flex w-1/2 hidden bg-gray-500 bg-no-repeat bg-cover relative items-center" style={{ backgroundImage: `url(${import.meta.env.VITE_IMAGE_LOGIN})` }}>
                <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
                <div className="w-full px-24 z-10">
                    <h1 className="text-5xl font-bold text-left tracking-wide">Welcome Back</h1>
                    <p className="text-3xl my-4">Log in to continue your journey.</p>
                </div>
            </div>
            <div className="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0" style={{ backgroundColor: '#161616' }}>
                <div className="w-full py-6 z-20">
                    <h1 className="my-6 text-4xl font-bold text-indigo-500">Iniciar Sesión</h1>
                    <form onSubmit={handleSubmit} className="sm:w-2/3 w-full px-4 lg:px-0 mx-auto" noValidate>
                        
                        <div className="py-2">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4"><MailIcon /></span>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo Electrónico" className="block w-full p-4 pl-12 text-lg rounded-lg bg-black border-2 border-transparent focus:border-indigo-500 focus:outline-none transition-colors" />
                            </div>
                        </div>

                        <div className="py-2">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4"><LockIcon /></span>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className="block w-full p-4 pl-12 text-lg rounded-lg bg-black border-2 border-transparent focus:border-indigo-500 focus:outline-none transition-colors" />
                            </div>
                        </div>
                        
                        {error && <div className="text-red-400 p-3 mt-4 text-sm bg-red-900 bg-opacity-30 rounded-lg flex items-center justify-center"><ErrorIcon />{error}</div>}

                        <div className="px-4 pb-2 pt-6">
                            <button type="submit" className="uppercase block w-full p-4 text-lg rounded-full bg-indigo-500 hover:bg-indigo-600 focus:outline-none transform hover:scale-105 transition-transform duration-300 shadow-lg shadow-indigo-500/20">
                                Iniciar Sesión
                            </button>
                        </div>
                    </form>
                    <p className="mt-4 text-sm text-gray-400">¿No tienes una cuenta?{' '}<Link to="/register" className="text-indigo-500 hover:underline">Regístrate aquí</Link></p>
                    <p className="mt-4 text-sm text-gray-400"><Link to="/" className="text-indigo-500 hover:underline">Volver a la página inicial</Link></p>
                </div>
            </div>
        </section>
    );
};

export default Login;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(import.meta.env.VITE_API_LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                localStorage.setItem('token', data.token);
                navigate('/user-home');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('Error al iniciar sesión');
        }
    };

    return (
        <section className="fixed inset-0 min-h-screen min-w-full flex items-stretch text-white">
            <div
                className="lg:flex w-1/2 hidden bg-gray-500 bg-no-repeat bg-cover relative items-center"
                style={{ backgroundImage: `url(${import.meta.env.VITE_IMAGE_LOGIN})` }}
            >
                <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
                <div className="w-full px-24 z-10">
                    <h1 className="text-5xl font-bold text-left tracking-wide">Welcome Back</h1>
                    <p className="text-3xl my-4">Log in to continue your journey.</p>
                </div>
            </div>
            <div className="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0" style={{ backgroundColor: '#161616' }}>
                <div className="w-full py-6 z-20">
                    <h1 className="my-6 text-4xl font-bold text-indigo-500">Iniciar Sesión</h1>
                    <form onSubmit={handleSubmit} className="sm:w-2/3 w-full px-4 lg:px-0 mx-auto">
                        <div className="pb-2 pt-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Correo Electrónico"
                                className="block w-full p-4 text-lg rounded-sm bg-black text-white"
                            />
                        </div>
                        <div className="pb-2 pt-4">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Contraseña"
                                className="block w-full p-4 text-lg rounded-sm bg-black text-white"
                            />
                        </div>
                        <div className="px-4 pb-2 pt-4">
                            <button
                                type="submit"
                                className="uppercase block w-full p-4 text-lg rounded-full bg-indigo-500 hover:bg-indigo-600 focus:outline-none"
                            >
                                Iniciar Sesión
                            </button>
                        </div>
                    </form>
                    <p className="mt-4 text-sm text-gray-400">
                        ¿No tienes una cuenta?{' '}
                        <Link to="/register" className="text-indigo-500 hover:underline">
                            Regístrate aquí
                        </Link>
                    </p>
                    <p className="mt-4 text-sm text-gray-400">
                        <Link to="/" className="text-indigo-500 hover:underline">
                            Volver a la página inicial
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Login;

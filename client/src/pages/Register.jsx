import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

const checkUsernameAvailability = async (username) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_REGISTER}/check-username`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        });
        const data = await response.json();
        return data.available;
    } catch (error) {
        console.error('Error al verificar el nombre de usuario:', error);
        return false;
    }
};

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleBlur = async (field) => {
        if (field === 'username') {
            const isAvailable = await checkUsernameAvailability(username);
            setErrors((prev) => ({
                ...prev,
                username: isAvailable ? '' : 'El nombre de usuario ya está en uso.',
            }));
        } else if (field === 'email') {
            setErrors((prev) => ({
                ...prev,
                email: validateEmail(email) ? '' : 'El email no es válido.',
            }));
        } else if (field === 'password') {
            setErrors((prev) => ({
                ...prev,
                password: validatePassword(password)
                    ? ''
                    : 'La contraseña debe tener al menos 8 caracteres, incluir letras, números y un carácter especial.',
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!errors.username && !errors.email && !errors.password) {
            try {
                const response = await fetch(import.meta.env.VITE_API_REGISTER, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    alert(data.message);
                    navigate('/user-home');
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error al registrar usuario:', error);
                alert('Error al registrar usuario');
            }
        } else {
            alert('Por favor, corrige los errores antes de enviar el formulario.');
        }
    };

    return (
        <section className="fixed inset-0 min-h-screen min-w-full flex items-stretch text-white">
            <div
                className="lg:flex w-1/2 hidden bg-gray-500 bg-no-repeat bg-cover relative items-center"
                style={{ backgroundImage: `url(${import.meta.env.VITE_IMAGE_REGISTER})` }}
            >
                <div className="absolute bg-black opacity-60 inset-0 z-0"></div>
                <div className="w-full px-24 z-10">
                    <h1 className="text-5xl font-bold text-left tracking-wide">Discover Your Next Adventure</h1>
                    <p className="text-3xl my-4">Your gaming story starts here, make it legendary.</p>
                </div>
            </div>
            <div className="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 px-0 z-0" style={{ backgroundColor: '#161616' }}>
                <div className="w-full py-6 z-20">
                    <h1 className="my-6 text-4xl font-bold text-indigo-500">Registro</h1>
                    <form onSubmit={handleSubmit} className="sm:w-2/3 w-full px-4 lg:px-0 mx-auto">
                        <div className="pb-2 pt-4">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onBlur={() => handleBlur('username')}
                                placeholder="Usuario"
                                className="block w-full p-4 text-lg rounded-sm bg-black text-white"
                            />
                            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                        </div>
                        <div className="pb-2 pt-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={() => handleBlur('email')}
                                placeholder="Correo Electrónico"
                                className="block w-full p-4 text-lg rounded-sm bg-black text-white"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                        <div className="pb-2 pt-4">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={() => handleBlur('password')}
                                placeholder="Contraseña"
                                className="block w-full p-4 text-lg rounded-sm bg-black text-white"
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>
                        <div className="px-4 pb-2 pt-4">
                            <button
                                type="submit"
                                className="uppercase block w-full p-4 text-lg rounded-full bg-indigo-500 hover:bg-indigo-600 focus:outline-none"
                            >
                                Registrarse
                            </button>
                        </div>
                    </form>
                    <p className="mt-4 text-sm text-gray-400">
                        ¿Ya tienes una cuenta?{' '}
                        <Link to="/login" className="text-indigo-500 hover:underline">
                            Inicia sesión aquí
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

export default Register;

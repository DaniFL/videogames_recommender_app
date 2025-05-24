import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <section className="fixed inset-0 min-h-screen min-w-full flex flex-col text-white" style={{ backgroundImage: `url(${import.meta.env.VITE_IMAGE_HOME})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <nav className="flex justify-between items-center p-6 bg-black bg-opacity-50">
                <h1 className="text-3xl font-bold text-indigo-500">GameRecommender</h1>
                <div className="space-x-4">
                    <Link to="/login" className="text-lg text-indigo-500 hover:text-indigo-300 font-semibold transition duration-300 ease-in-out transform hover:scale-105">Iniciar Sesión</Link>
                    <Link to="/register" className="text-lg text-indigo-500 hover:text-indigo-300 font-semibold transition duration-300 ease-in-out transform hover:scale-105">Registrarse</Link>
                </div>
            </nav>
            <div className="flex flex-col items-center justify-center flex-grow text-center px-6">
                <h1 className="text-5xl font-bold mb-4">Bienvenido a GameRecommender</h1>
                <p className="text-3xl mb-6">Descubre los mejores videojuegos adaptados a tus gustos y comienza tu próxima aventura épica.</p>
                <p className="text-2xl italic">Tu viaje gamer empieza aquí.</p>
            </div>
        </section>
    );
};

export default Home;

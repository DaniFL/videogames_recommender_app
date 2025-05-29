import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
    return (
        <section className="fixed inset-0 min-h-screen min-w-full flex flex-col text-white" style={{ backgroundImage: `url(${import.meta.env.VITE_IMAGE_HOME})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <Navbar isAuthenticated={false} />
            <div className="flex flex-col items-center justify-center flex-grow text-center px-6">
                <h1 className="text-5xl font-bold mb-4">Bienvenido a GameRecommender</h1>
                <p className="text-3xl mb-6">Descubre los mejores videojuegos adaptados a tus gustos y comienza tu próxima aventura épica.</p>
                <p className="text-2xl italic">Tu viaje gamer empieza aquí.</p>
            </div>
        </section>
    );
};

export default Home;

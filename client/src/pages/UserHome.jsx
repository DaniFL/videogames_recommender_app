import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const UserHome = () => {
    const [avatar, setAvatar] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [search, setSearch] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const handleAvatarChange = (e) => {
        setAvatar(e.target.files[0]);
    };

    const generateAvatarUrl = (seed) => {
        return `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}`;
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (query.length > 2) {
            // Simulate fetching suggestions from backend
            const response = await fetch(`/api/steam-games?query=${query}`);
            const data = await response.json();
            setSuggestions(data);
        } else {
            setSuggestions([]);
        }
    };

    const handleAddFavorite = (game) => {
        if (favorites.length < 5 && !favorites.includes(game)) {
            setFavorites([...favorites, game]);
        }
    };

    const handleRemoveFavorite = (game) => {
        setFavorites(favorites.filter((fav) => fav !== game));
    };

    const handleSubmit = () => {
        if (favorites.length < 5) {
            alert('Por favor selecciona 5 videojuegos favoritos.');
            return;
        }
        // Simulate submitting data to backend
        console.log({ avatar, favorites });
        setShowPopup(false);
    };

    return (
        <div className="fixed inset-0 min-h-screen min-w-full flex flex-col bg-gray-100">
            <nav className="flex justify-between items-center p-6 bg-black bg-opacity-50 w-full">
                <h1 className="text-3xl font-bold text-indigo-500">GameRecommender</h1>
                <div className="space-x-4">
                    <Link to="/user-home" className="text-lg text-indigo-500 hover:text-indigo-300 font-semibold transition duration-300 ease-in-out transform hover:scale-105">Inicio</Link>
                    <Link to="/user-settings" className="text-lg text-indigo-500 hover:text-indigo-300 font-semibold transition duration-300 ease-in-out transform hover:scale-105">Configuración</Link>
                    <Link to="/" className="text-lg text-indigo-500 hover:text-indigo-300 font-semibold transition duration-300 ease-in-out transform hover:scale-105">Cerrar Sesión</Link>
                </div>
            </nav>
            <main className="flex-grow container mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold mb-4">Tu Página de Inicio</h2>
                <p className="text-gray-700">Aquí puedes explorar tus videojuegos favoritos, recomendaciones personalizadas y mucho más.</p>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Aquí se pueden mostrar tarjetas de videojuegos o contenido personalizado */}
                    <div className="bg-white shadow-md rounded-lg p-4">
                        <h3 className="text-xl font-bold">Juego 1</h3>
                        <p className="text-gray-600">Descripción breve del juego.</p>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-4">
                        <h3 className="text-xl font-bold">Juego 2</h3>
                        <p className="text-gray-600">Descripción breve del juego.</p>
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-4">
                        <h3 className="text-xl font-bold">Juego 3</h3>
                        <p className="text-gray-600">Descripción breve del juego.</p>
                    </div>
                </div>
            </main>
            <footer className="w-full bg-gray-800 text-white py-4">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; 2025 VideoGames Recommender App. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default UserHome;

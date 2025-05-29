import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

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
        <div className="relative flex size-full min-h-screen flex-col bg-[#111418] dark group/design-root overflow-x-hidden" style={{ fontFamily: 'Plus Jakarta Sans, Noto Sans, sans-serif' }}>
            <Navbar isAuthenticated={true} />
            <div className="layout-container flex h-full grow flex-col">
                <div className="px-40 flex flex-1 justify-center py-5">
                    <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                        <h2 className="text-white tracking-light text-[28px] font-bold leading-tight px-4 text-left pb-3 pt-5">¡Hola, Usuario!</h2>
                        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Recomendaciones para ti</h2>
                        <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            <div className="flex items-stretch p-4 gap-3">
                                {/* Example recommendation cards */}
                                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-60">
                                    <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl flex flex-col" style={{ backgroundImage: `url('https://example.com/image1.jpg')` }}></div>
                                    <div>
                                        <p className="text-white text-base font-medium leading-normal">El Legado de la Estrella</p>
                                        <p className="text-[#9cabba] text-sm font-normal leading-normal">RPG de acción</p>
                                    </div>
                                </div>
                                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-60">
                                    <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl flex flex-col" style={{ backgroundImage: `url('https://example.com/image2.jpg')` }}></div>
                                    <div>
                                        <p className="text-white text-base font-medium leading-normal">Cazadores de la Noche</p>
                                        <p className="text-[#9cabba] text-sm font-normal leading-normal">Aventura de mundo abierto</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Popular ahora</h2>
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
                            {/* Example popular cards */}
                            <div className="flex flex-col gap-3 pb-3">
                                <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl" style={{ backgroundImage: `url('https://example.com/popular1.jpg')` }}></div>
                                <p className="text-white text-base font-medium leading-normal">El Legado de la Estrella</p>
                            </div>
                            <div className="flex flex-col gap-3 pb-3">
                                <div className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl" style={{ backgroundImage: `url('https://example.com/popular2.jpg')` }}></div>
                                <p className="text-white text-base font-medium leading-normal">Cazadores de la Noche</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserHome;

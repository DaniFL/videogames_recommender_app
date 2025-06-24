// src/pages/UserHome.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturedGame from '../components/FeaturedGame';
import GameList from '../components/GameList';
import Footer from '../components/Footer';
import RecommendationModal from '../components/RecommendationModal';

const UserHome = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [newReleases, setNewReleases] = useState([]);
    const [topSellers, setTopSellers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSteamData = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/steam/featured-categories');
                
                // Filtramos la lista de "Nuevos Lanzamientos"
                if (response.data.new_releases) {
                    const allNewReleases = response.data.new_releases.items;
                    const newGamesOnly = allNewReleases.filter(item => item.type === 0);
                    setNewReleases(newGamesOnly);
                }

                // Filtramos la lista de "Top Ventas"
                if (response.data.top_sellers) {
                    const allTopSellers = response.data.top_sellers.items;
                    // ¡AQUÍ ESTÁ LA LÓGICA CLAVE!
                    const topGamesOnly = allTopSellers.filter(item => item.type === 0 && item.name !== "Steam Deck");
                    setTopSellers(topGamesOnly);
                }

            } catch (error) {
                console.error("Error al obtener datos de Steam:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSteamData();
    }, []);

    // El resto del componente y el JSX se mantienen exactamente igual
    return (
        <div className="flex flex-col min-h-screen bg-[#111418]">
            <Navbar />
            <main className="flex-grow">
                <HeroSection onGetRecommendationClick={() => setIsModalOpen(true)} />
                <div className="container mx-auto px-4 py-12">
                    <FeaturedGame />
                    {isLoading ? (
                        <div className="text-center text-white mt-16">Cargando listas de juegos...</div>
                    ) : (
                        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
                            <GameList title="Nuevos Lanzamientos" games={newReleases} />
                            <GameList title="Top Ventas" games={topSellers} />
                        </div>
                    )}
                </div>
            </main>
            <Footer />
            <RecommendationModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default UserHome;
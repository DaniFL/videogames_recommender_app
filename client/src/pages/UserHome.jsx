// src/pages/UserHome.jsx

import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import RecommendationModal from '../components/RecommendationModal';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturedGame from '../components/FeaturedGame';
import GameList from '../components/GameList';
import Footer from '../components/Footer';

const UserHome = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
  // Placeholder para los datos que vendrán de tu API más adelante
  const newReleases = [
    {
      id: 1,
      name: "Cyberpunk 2077: Phantom Liberty",
      image: "https://cdn.akamai.steamstatic.com/steam/apps/2138330/header.jpg",
    },
    {
      id: 2,
      name: "Starfield",
      image: "https://cdn.akamai.steamstatic.com/steam/apps/1716740/header.jpg",
    },
    {
      id: 3,
      name: "Elden Ring",
      image: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
    },
  ];

  const topRatedGames = [
    {
      id: 4,
      name: "Portal 2",
      image: "https://cdn.akamai.steamstatic.com/steam/apps/620/header.jpg",
    },
    {
      id: 5,
      name: "Stardew Valley",
      image: "https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg",
    },
    {
      id: 6,
      name: "Hades",
      image: "https://cdn.akamai.steamstatic.com/steam/apps/1145360/header.jpg",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#111418]">
      {/* --- 1. BARRA DE NAVEGACIÓN --- */}
      <Navbar />

      <main className="flex-grow">
        {/* --- 2. SECCIÓN SUPERIOR (HERO) --- */}
        <HeroSection onGetRecommendationClick={() => setIsModalOpen(true)} />

        {/* --- 3. SECCIÓN INFERIOR (CONTENIDO) --- */}
        <div className="container mx-auto px-4 py-12">
          <FeaturedGame />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
            <GameList title="Nuevos Lanzamientos" games={newReleases} />
            <GameList title="Los Más Valorados" games={topRatedGames} />
          </div>
        </div>
      </main>

      {/* --- 4. FOOTER --- */}
      <Footer />

      {/* --- MODAL (Componente flotante) --- */}
      <RecommendationModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
            />
    </div>
  );
};

export default UserHome;
// src/components/HeroSection.jsx

import React from 'react';

const HeroSection = ({ onGetRecommendationClick }) => {
    return (
        <div
            className="relative h-[60vh] flex items-center justify-center text-center text-white px-4"
            style={{
                backgroundImage: `linear-gradient(rgba(17, 20, 24, 0.8), rgba(17, 20, 24, 0.8)), url('https://images.unsplash.com/photo-1585620385354-f7f1e5a8d957?q=80&w=2070')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="max-w-3xl">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight uppercase">
                    Descubre Tu Próxima Obsesión
                </h1>
                <p className="mt-4 text-lg md:text-xl text-gray-300">
                    Deja de buscar y empieza a jugar. Danos tus juegos favoritos y desvelaremos joyas ocultas perfectas para ti.
                </p>
                <button
                    onClick={onGetRecommendationClick}
                    className="mt-8 px-8 py-3 bg-purple-600 font-semibold rounded-lg hover:bg-purple-700 transform hover:scale-105 transition-all duration-300 ease-in-out shadow-lg"
                >
                    Obtener Recomendación Personalizada
                </button>
            </div>
        </div>
    );
};

export default HeroSection;
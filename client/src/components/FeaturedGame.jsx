// src/components/FeaturedGame.jsx

import React from 'react';

const FeaturedGame = () => (
    <div className="bg-gray-800 rounded-lg overflow-hidden flex flex-col md:flex-row">
        <img src="https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg" alt="Dota 2" className="w-full md:w-1/2 h-64 md:h-auto object-cover" />
        <div className="p-8 flex flex-col justify-center">
            <h3 className="text-sm text-purple-400 uppercase font-semibold">Juego del Día</h3>
            <h2 className="text-4xl text-white font-bold mt-2">Dota 2</h2>
            <p className="text-gray-400 mt-4">
                Cada día, millones de jugadores de todo el mundo entran en batalla como uno de los más de cien héroes de Dota. Y no importa si es su décima o su milésima hora de juego: siempre hay algo nuevo que descubrir.
            </p>
            <button className="mt-6 px-5 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 self-start"
                onClick={() => window.open('https://store.steampowered.com/app/570', '_blank')}>
                Ver en Steam
            </button>
        </div>
    </div>
);

export default FeaturedGame;
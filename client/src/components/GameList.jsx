// src/components/GameList.jsx

import React from 'react';

const GameList = ({ title, games }) => (
    <div>
        <h3 className="text-2xl font-bold text-white mb-6">{title}</h3>
        <ul className="space-y-4">
            {games.map(game => (
                <li key={game.id} className="flex items-center gap-4 bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors">
                    <img src={game.image} alt={game.name} className="w-24 h-11 object-cover rounded" />
                    <span className="text-white font-semibold">{game.name}</span>
                </li>
            ))}
        </ul>
    </div>
);

export default GameList;
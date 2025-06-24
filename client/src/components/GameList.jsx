// src/components/GameList.jsx

import React from 'react';

const GameList = ({ title, games }) => (
    <div>
        <h3 className="text-2xl font-bold text-white mb-6">{title}</h3>
        <ul className="space-y-4">
            {games.slice(0, 6).map(game => {
                // Construimos la URL de la tienda de Steam para cada juego
                const steamUrl = `https://store.steampowered.com/app/${game.id}`;

                return (
                    // 1. Envolvemos todo el elemento de la lista en una etiqueta <a>
                    //    para que toda la fila sea un enlace clickeable.
                    <a
                        key={game.id}
                        href={steamUrl}
                        target="_blank" // 2. Para que se abra en una nueva pestaña
                        rel="noopener noreferrer" // 3. Por buenas prácticas de seguridad
                        className="flex items-center gap-4 bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        <img src={game.header_image} alt={game.name} className="w-24 h-11 object-cover rounded" />
                        <span className="text-white font-semibold">{game.name}</span>
                    </a>
                );
            })}
        </ul>
    </div>
);

export default GameList;
// src/components/RecommendationModal.jsx

import React, { useState, useContext } from 'react'; // <-- CORRECCIÓN 1: Importamos useState
import { UserContext } from '../context/UserContext';
import api from '../services/api';

const RecommendationModal = ({ isOpen, onClose }) => {
    const { user } = useContext(UserContext);

    const [games, setGames] = useState(['', '', '']);
    const [recommendations, setRecommendations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Añadimos la función que faltaba para manejar los inputs
    const handleInputChange = (index, value) => {
        const newGames = [...games];
        newGames[index] = value;
        setGames(newGames);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const favoriteGames = games.filter(g => g.trim() !== '');

        if (favoriteGames.length === 0) {
            setError('Por favor, introduce al menos un juego.');
            return;
        }
        
        // <-- CORRECCIÓN 2: Comprobamos el objeto 'user' directamente
        if (!user || !user.id) {
            setError('No se pudo identificar al usuario. Por favor, refresca la página.');
            return;
        }

        setIsLoading(true);
        setError('');
        setRecommendations([]);

        try {
            const response = await api.post('/recommendations', {
                userId: user.id, // <-- CORRECCIÓN 3: Usamos user.id
                positiveGames: favoriteGames
            });
            setRecommendations(response.data);
        } catch (err) {
            setError('No se pudieron obtener las recomendaciones. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };
    
    // El resto del JSX del modal se mantiene exactamente igual...
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            {/* El JSX del div que contiene el formulario y los resultados no necesita cambios.
                Asegúrate de que la llamada a handleInputChange en el input es correcta, como en el código
                que te proporcioné en la respuesta anterior. */}
            <div className="bg-[#1a1e22] text-white rounded-lg p-8 max-w-lg w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Crea tu recomendación</h2>
                    <button onClick={onClose} className="text-2xl">&times;</button>
                </div>

                {recommendations.length === 0 ? (
                    <form onSubmit={handleSubmit}>
                        <p className="mb-4 text-gray-400">Introduce de 1 a 3 de tus juegos favoritos para empezar.</p>
                        {games.map((game, index) => (
                            <input
                                key={index}
                                type="text"
                                value={game}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                placeholder={`Juego favorito #${index + 1}`}
                                className="w-full bg-[#111418] p-3 rounded mb-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        ))}
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <button type="submit" disabled={isLoading} className="w-full py-3 bg-purple-600 rounded font-semibold hover:bg-purple-700 disabled:bg-gray-500">
                            {isLoading ? 'Buscando...' : 'Encuentra mis juegos'}
                        </button>
                    </form>
                ) : (
                    <div>
                        <h3 className="text-xl font-bold mb-4">¡Aquí tienes! Basado en tus gustos:</h3>
                        <ul className="space-y-2">
                            {recommendations.map((rec, index) => {
                                const gameName = Object.keys(rec)[0];
                                return <li key={index} className="bg-gray-700 p-3 rounded">{gameName}</li>
                            })}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecommendationModal;
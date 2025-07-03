import React, { useState, useEffect, useRef, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import api from '../services/api';
import RecommendationCard from './RecommendationCard';

const RecommendationModal = ({ isOpen, onClose }) => {
    const { user } = useContext(UserContext);

    // ✅ Define el estado inicial para poder reutilizarlo fácilmente.
    const initialState = {
        games: ['', '', ''],
        recommendations: [],
        isLoading: false,
        error: '',
        suggestions: [],
        activeInput: null,
    };

    const [games, setGames] = useState(initialState.games);
    const [recommendations, setRecommendations] = useState(initialState.recommendations);
    const [isLoading, setIsLoading] = useState(initialState.isLoading);
    const [error, setError] = useState(initialState.error);
    const [suggestions, setSuggestions] = useState(initialState.suggestions);
    const [activeInput, setActiveInput] = useState(initialState.activeInput);

    const debounceTimeout = useRef(null);
    const modalRef = useRef(null);
    
    // ✅ Función centralizada para reiniciar todo el estado.
    const resetState = () => {
        setGames(initialState.games);
        setRecommendations(initialState.recommendations);
        setIsLoading(initialState.isLoading);
        setError(initialState.error);
        setSuggestions(initialState.suggestions);
        setActiveInput(initialState.activeInput);
    };

    // ✅ Función que reinicia el estado y luego cierra el modal.
    const handleClose = () => {
        resetState();
        onClose();
    };

    const fetchSuggestions = async (query) => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }
        try {
            const response = await api.get(`/games/search?query=${query}`);
            setSuggestions(response.data);
        } catch (err) {
            console.error("Error al obtener sugerencias:", err);
            setSuggestions([]);
        }
    };

    const handleInputChange = (index, value) => {
        const newGames = [...games];
        newGames[index] = value;
        setGames(newGames);
        setActiveInput(index);
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
            fetchSuggestions(value);
        }, 300);
    };

    const handleSuggestionClick = (index, gameName) => {
        const newGames = [...games];
        newGames[index] = gameName;
        setGames(newGames);
        setSuggestions([]);
        setActiveInput(null);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setActiveInput(null);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const favoriteGames = games.filter(g => g.trim() !== '');
        if (favoriteGames.length === 0) {
            setError('Por favor, introduce al menos un juego.');
            return;
        }
        if (!user || !user.id) {
            setError('No se pudo identificar al usuario. Por favor, refresca la página.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            const response = await api.post('/recommendations', {
                userId: user.id,
                positiveGames: favoriteGames
            });
            setRecommendations(response.data);
        } catch (err) {
            setError('No se pudieron obtener las recomendaciones. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div ref={modalRef} className="bg-[#1a1e22] text-white rounded-lg p-8 max-w-4xl w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Crea tu recomendación</h2>
                    {/* El botón de cerrar ahora llama a nuestra nueva función handleClose */}
                    <button onClick={handleClose} className="text-2xl hover:text-purple-400 transition-colors">&times;</button>
                </div>

                {recommendations.length === 0 ? (
                    <form onSubmit={handleSubmit}>
                        <p className="mb-4 text-gray-400">Escribe el nombre de 1 a 3 de tus juegos favoritos.</p>
                        {games.map((game, index) => (
                            <div key={index} className="relative mb-4">
                                <input
                                    type="text"
                                    value={game}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    onFocus={() => setActiveInput(index)}
                                    placeholder={`Juego favorito #${index + 1}`}
                                    className="w-full bg-[#111418] p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    autoComplete="off"
                                />
                                {activeInput === index && suggestions.length > 0 && (
                                    <ul className="absolute w-full mt-1 bg-[#283039] border border-gray-600 rounded-lg max-h-48 overflow-y-auto z-20">
                                        {suggestions.map((suggestion) => (
                                            <li
                                                key={suggestion.appid}
                                                onClick={() => handleSuggestionClick(index, suggestion.name)}
                                                className="p-3 hover:bg-purple-600 cursor-pointer text-sm"
                                            >
                                                {suggestion.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <button type="submit" disabled={isLoading} className="w-full mt-2 py-3 bg-purple-600 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-500 transition-colors">
                            {isLoading ? 'Buscando...' : 'Encuentra mis juegos'}
                        </button>
                    </form>
                ) : (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">¡Aquí tienes! Basado en tus gustos:</h3>
                            <button onClick={resetState} className="text-sm bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                                Empezar de nuevo
                            </button>
                        </div>
                        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                            {recommendations.map((game) => (
                                <RecommendationCard key={game.appid} game={game} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecommendationModal;
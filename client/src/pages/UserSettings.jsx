import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UserSettings = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        username: 'Usuario123',
        email: 'usuario@example.com',
        avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Usuario123',
    });

    useEffect(() => {
        let isMounted = true; // Flag to prevent state updates if the component is unmounted

        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No token found in localStorage');
                    return;
                }

                const response = await axios.get(`${import.meta.env.VITE_API_URL}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (isMounted && response.data) {
                    setUserData(response.data);
                } else {
                    console.error('No user data returned from API');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();

        return () => {
            isMounted = false; // Cleanup function to prevent state updates after unmounting
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSave = () => {
        // Aquí puedes enviar los datos actualizados al backend
        console.log('Datos guardados:', userData);
        setIsEditing(false);
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
            <div className="flex-grow flex items-center justify-center w-full">
                <div className="bg-white shadow-md rounded-lg p-6 w-96">
                    <h2 className="text-2xl font-bold mb-4">Configuración del Usuario</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Avatar:</label>
                        <img
                            src={userData.avatar}
                            alt="Avatar"
                            className="w-24 h-24 rounded-full border border-gray-300 mb-2"
                        />
                        {isEditing && (
                            <input
                                type="text"
                                name="avatar"
                                value={userData.avatar}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2"
                            />
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Nombre de Usuario:</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="username"
                                value={userData.username}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2"
                            />
                        ) : (
                            <p className="text-gray-700">{userData.username}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Correo Electrónico:</label>
                        {isEditing ? (
                            <input
                                type="email"
                                name="email"
                                value={userData.email}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2"
                            />
                        ) : (
                            <p className="text-gray-700">{userData.email}</p>
                        )}
                    </div>
                    {isEditing ? (
                        <button
                            onClick={handleSave}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
                        >
                            Guardar
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg w-full"
                        >
                            Editar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserSettings;

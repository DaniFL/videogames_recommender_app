import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { UserContext } from '../context/UserContext';

const UserSettings = () => {
    const { setAvatar } = useContext(UserContext);
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({ username: '', email: '', avatar: '' });
    const [avatarOptions, setAvatarOptions] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await axios.get(`${import.meta.env.VITE_API_USER}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (isMounted && response.data) {
                    setUserData(response.data);
                    setAvatar(response.data.avatar); // Asegura que el avatar se actualice en el contexto
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        // Lista de imágenes locales en /public/img/avatar
        const images = Array.from({ length: 22 }, (_, i) => `${import.meta.env.VITE_AVATARS}${i + 1}.jpg`);
        setAvatarOptions(images);

        fetchUserData();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${import.meta.env.VITE_API_USER}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Perfil actualizado correctamente:', data);
                setAvatar(data.avatar); // Actualiza el avatar en el contexto
                setIsEditing(false);
                window.location.reload(); // Refresca la página automáticamente
            } else {
                const errorData = await response.json();
                console.error('Error al actualizar el perfil:', errorData.message);
            }
        } catch (error) {
            console.error('Error al guardar los datos del perfil:', error);
        }
    };

    return (
        <div
            className="relative flex size-full min-h-screen flex-col bg-[#111418] dark group/design-root overflow-x-hidden"
            style={{ fontFamily: 'Plus Jakarta Sans, Noto Sans, sans-serif' }}
        >
            <Navbar isAuthenticated={true} />
            <div className="layout-container flex h-full grow flex-col">
                <div className="gap-1 px-6 flex flex-1 justify-start py-5">
                    <div className="layout-content-container flex flex-col w-80 ml-8">
                        <div className="flex h-full min-h-[700px] flex-col justify-between bg-[#111418] p-4">
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-3">
                                    <div
                                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                                        style={{ backgroundImage: `url(${userData.avatar})` }}
                                    ></div>
                                    <div className="flex flex-col">
                                        <h1 className="text-white text-base font-medium leading-normal">{userData.username}</h1>
                                        <p className="text-[#9cabba] text-sm font-normal leading-normal">@{userData.username?.toLowerCase()}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3 px-3 py-2">
                                        <p className="text-white text-sm font-medium leading-normal">Inicio</p>
                                    </div>
                                    <div className="flex items-center gap-3 px-3 py-2">
                                        <p className="text-white text-sm font-medium leading-normal">Explorar</p>
                                    </div>
                                    <div className="flex items-center gap-3 px-3 py-2">
                                        <p className="text-white text-sm font-medium leading-normal">Mis juegos</p>
                                    </div>
                                    <div className="flex items-center gap-3 px-3 py-2">
                                        <p className="text-white text-sm font-medium leading-normal">Amigos</p>
                                    </div>
                                    <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#283039]">
                                        <p className="text-white text-sm font-medium leading-normal">Perfil</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="layout-content-container flex flex-col max-w-[960px] flex-1 mx-auto">
                        <div className="flex flex-wrap justify-between gap-3 p-4">
                            <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">Configuración del perfil</p>
                        </div>

                        <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Información del perfil</h3>

                        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                            <label className="flex flex-col min-w-40 flex-1">
                                <p className="text-white text-base font-medium leading-normal pb-2">Nombre</p>
                                <input
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border border-[#3b4754] bg-[#1b2127] focus:border-[#3b4754] h-14 placeholder:text-[#9cabba] p-[15px] text-base font-normal leading-normal"
                                    name="username"
                                    value={userData.username}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </label>
                        </div>

                        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                            <label className="flex flex-col min-w-40 flex-1">
                                <p className="text-white text-base font-medium leading-normal pb-2">Correo electrónico</p>
                                <input
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border border-[#3b4754] bg-[#1b2127] focus:border-[#3b4754] h-14 placeholder:text-[#9cabba] p-[15px] text-base font-normal leading-normal"
                                    name="email"
                                    value={userData.email}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                />
                            </label>
                        </div>

                        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                            <label className="flex flex-col min-w-40 flex-1">
                                <p className="text-white text-base font-medium leading-normal pb-2">Avatar actual</p>
                                <div className="flex flex-col items-center gap-4 px-4 py-3">
                                    <div
                                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-20"
                                        style={{ backgroundImage: `url(${userData.avatar})` }}
                                    ></div>
                                </div>
                            </label>
                        </div>

                        {/* Galería de avatares justo después del avatar actual */}
                        {isEditing && (
                            <div className="px-4 py-2 flex flex-col gap-6">
                                <div>
                                    <h3 className="text-white text-lg font-bold pb-4">Elige tu avatar</h3>
                                    <div className="grid grid-cols-5 gap-4">
                                        {avatarOptions.map((src, index) => (
                                            <img
                                                key={index}
                                                src={src}
                                                alt={`avatar-${index}`}
                                                onClick={() =>
                                                    setUserData({
                                                        ...userData,
                                                        avatar: src,
                                                    })
                                                }
                                                className={`rounded-full cursor-pointer object-cover w-16 h-16 border-2 transition duration-200 ${
                                                    userData.avatar === src
                                                        ? 'border-[#0c7ff2]'
                                                        : 'border-transparent hover:border-[#0c7ff2]'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex px-4 py-3 justify-end">
                            <button
                                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#0c7ff2] text-white text-sm font-bold leading-normal tracking-[0.015em]"
                                onClick={isEditing ? handleSave : toggleEdit}
                            >
                                <span className="truncate">{isEditing ? 'Guardar cambios' : 'Modificar perfil'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserSettings;
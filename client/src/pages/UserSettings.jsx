import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const UserSettings = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        username: 'Usuario123',
        email: 'usuario@example.com',
        avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Usuario123',
    });

    useEffect(() => {
        let isMounted = true;

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
            isMounted = false;
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSave = () => {
        console.log('Datos guardados:', userData);
        setIsEditing(false);
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
                                        <p className="text-[#9cabba] text-sm font-normal leading-normal">@{userData.username.toLowerCase()}</p>
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
                                />
                            </label>
                        </div>
                        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                            <label className="flex flex-col min-w-40 flex-1">
                                <p className="text-white text-base font-medium leading-normal pb-2">Bio</p>
                                <textarea
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border border-[#3b4754] bg-[#1b2127] focus:border-[#3b4754] min-h-36 placeholder:text-[#9cabba] p-[15px] text-base font-normal leading-normal"
                                    name="bio"
                                    value={userData.bio || ''}
                                    onChange={handleInputChange}
                                ></textarea>
                            </label>
                        </div>
                        <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Preferencias de juego</h3>
                        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                            <label className="flex flex-col min-w-40 flex-1">
                                <p className="text-white text-base font-medium leading-normal pb-2">Género favorito</p>
                                <select
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border border-[#3b4754] bg-[#1b2127] focus:border-[#3b4754] h-14 bg-[image:--select-button-svg] placeholder:text-[#9cabba] p-[15px] text-base font-normal leading-normal"
                                    name="favoriteGenre"
                                    value={userData.favoriteGenre || ''}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Selecciona un género</option>
                                    <option value="accion">Acción</option>
                                    <option value="aventura">Aventura</option>
                                    <option value="rpg">RPG</option>
                                </select>
                            </label>
                        </div>
                        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                            <label className="flex flex-col min-w-40 flex-1">
                                <p className="text-white text-base font-medium leading-normal pb-2">Plataforma preferida</p>
                                <select
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border border-[#3b4754] bg-[#1b2127] focus:border-[#3b4754] h-14 bg-[image:--select-button-svg] placeholder:text-[#9cabba] p-[15px] text-base font-normal leading-normal"
                                    name="preferredPlatform"
                                    value={userData.preferredPlatform || ''}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Selecciona una plataforma</option>
                                    <option value="pc">PC</option>
                                    <option value="playstation">PlayStation</option>
                                    <option value="xbox">Xbox</option>
                                </select>
                            </label>
                        </div>
                        <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Configuración de la aplicación</h3>
                        <div className="flex items-center gap-4 bg-[#111418] px-4 min-h-[72px] py-2 justify-between">
                            <div className="flex flex-col justify-center">
                                <p className="text-white text-base font-medium leading-normal line-clamp-1">Notificaciones</p>
                                <p className="text-[#9cabba] text-sm font-normal leading-normal line-clamp-2">Recibe notificaciones sobre nuevos juegos, actualizaciones y eventos.</p>
                            </div>
                            <div className="shrink-0">
                                <label
                                    className="relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none bg-[#283039] p-0.5 has-[:checked]:justify-end has-[:checked]:bg-[#0c7ff2]"
                                >
                                    <div className="h-full w-[27px] rounded-full bg-white" style={{ boxShadow: 'rgba(0, 0, 0, 0.15) 0px 3px 8px, rgba(0, 0, 0, 0.06) 0px 3px 1px' }}></div>
                                    <input type="checkbox" className="invisible absolute" />
                                </label>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-[#111418] px-4 min-h-[72px] py-2 justify-between">
                            <div className="flex flex-col justify-center">
                                <p className="text-white text-base font-medium leading-normal line-clamp-1">Privacidad</p>
                                <p className="text-[#9cabba] text-sm font-normal leading-normal line-clamp-2">Controla quién puede ver tu perfil y actividad.</p>
                            </div>
                            <div className="shrink-0">
                                <label
                                    className="relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none bg-[#283039] p-0.5 has-[:checked]:justify-end has-[:checked]:bg-[#0c7ff2]"
                                >
                                    <div className="h-full w-[27px] rounded-full bg-white" style={{ boxShadow: 'rgba(0, 0, 0, 0.15) 0px 3px 8px, rgba(0, 0, 0, 0.06) 0px 3px 1px' }}></div>
                                    <input type="checkbox" className="invisible absolute" />
                                </label>
                            </div>
                        </div>
                        <div className="flex px-4 py-3 justify-end">
                            <button
                                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#0c7ff2] text-white text-sm font-bold leading-normal tracking-[0.015em]"
                                onClick={handleSave}
                            >
                                <span className="truncate">Guardar cambios</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserSettings;

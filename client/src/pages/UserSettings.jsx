import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const UserSettings = () => {
    // 1. Obtenemos el estado global del UserContext
    const { user, updateUser, isLoading: isContextLoading } = useContext(UserContext);

    // 2. Estados locales para manejar el formulario
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({ username: '', email: '', avatar: '' });
    const [avatarOptions, setAvatarOptions] = useState([]);

    // 3. useEffect para sincronizar el estado del formulario con los datos del contexto
    useEffect(() => {
        // Cuando el contexto tenga los datos del usuario, los cargamos en el formulario
        if (user) {
            setUserData({
                username: user.username || '',
                email: user.email || '',
                avatar: user.avatar || ''
            });
        }

        // Cargamos las opciones de avatares (esto se mantiene igual)
        const images = Array.from({ length: 22 }, (_, i) => `${import.meta.env.VITE_AVATARS}${i + 1}.jpg`);
        setAvatarOptions(images);
    }, [user]); // Este efecto se ejecuta cuando el 'user' del contexto esté disponible o cambie

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({ ...prevState, [name]: value }));
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    // 4. Función de guardado simplificada y segura
    const handleSave = async () => {
        try {
            const promise = api.put('/user/profile', userData);
            
            // Usamos toast.promise para manejar los estados de carga, éxito y error
            toast.promise(promise, {
                loading: 'Guardando cambios...',
                success: (response) => {
                    updateUser(response.data); // Actualizamos el contexto global
                    setIsEditing(false); // Salimos del modo edición
                    return 'Perfil actualizado con éxito'; // Mensaje para el toast
                },
                error: (error) => {
                    const errorMessage = error.response?.data?.message || 'Error al guardar los cambios.';
                    return errorMessage; // Mensaje para el toast de error
                }
            });

        } catch (error) {
            // Este catch es por si hay un error que no sea de la petición de red
            console.error('Error inesperado al intentar guardar:', error);
            toast.error('Ocurrió un error inesperado.');
        }
    };
    // 5. Estado de carga para una mejor experiencia de usuario
    if (isContextLoading) {
        return (
            <div className="bg-[#111418] min-h-screen text-white flex items-center justify-center text-xl">
                Cargando perfil...
            </div>
        );
    }
    
    // Si no hay usuario después de la carga, no se puede ver la página
    if (!user) {
        return (
            <div className="relative flex size-full min-h-screen flex-col bg-[#111418]">
                <Navbar />
                <div className="text-white text-center p-10 text-xl">
                    Necesitas <Link to="/login" className="text-purple-400 hover:underline">iniciar sesión</Link> para ver tu perfil.
                </div>
            </div>
        );
    }

    // 6. El JSX que diseñaste, ahora completamente funcional
    return (
        <div
            className="relative flex size-full min-h-screen flex-col bg-[#111418] dark group/design-root overflow-x-hidden"
            style={{ fontFamily: 'Plus Jakarta Sans, Noto Sans, sans-serif' }}>
            <Navbar />
            <div className="layout-container flex h-full grow flex-col">
                <div className="gap-1 px-6 flex flex-1 justify-start py-5">
                    <div className="layout-content-container flex flex-col w-80 ml-8">
                        <div className="flex h-full min-h-[700px] flex-col justify-start bg-[#111418] p-4">
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
                                <div className="flex flex-col gap-2 mt-4">
                                    <Link to="/user-home" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#283039] transition-colors">
                                        <p className="text-white text-sm font-medium leading-normal">Inicio</p>
                                    </Link>
                                    {/* Añade aquí los demás enlaces que necesites */}
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
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border border-[#3b4754] bg-[#1b2127] focus:border-[#3b4754] h-14 placeholder:text-[#9cabba] p-[15px] text-base font-normal leading-normal disabled:opacity-70"
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
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-white focus:outline-0 focus:ring-0 border border-[#3b4754] bg-[#1b2127] focus:border-[#3b4754] h-14 placeholder:text-[#9cabba] p-[15px] text-base font-normal leading-normal disabled:opacity-70"
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

                        {isEditing && (
                            <div className="px-4 py-2 flex flex-col gap-6">
                                <div>
                                    <h3 className="text-white text-lg font-bold pb-4">Elige tu avatar</h3>
                                    <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-4">
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
                                                        ? 'border-purple-500 ring-2 ring-purple-500'
                                                        : 'border-transparent hover:border-purple-500'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex px-4 py-3 mt-4 justify-end">
                            <button
                                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-purple-600 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-purple-700 transition-colors"
                                onClick={isEditing ? handleSave : toggleEdit}
                            >
                                <span className="truncate">{isEditing ? 'Guardar Cambios' : 'Modificar Perfil'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserSettings;
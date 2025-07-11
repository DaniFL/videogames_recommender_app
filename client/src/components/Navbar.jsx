// src/components/Navbar.jsx
import React, { useContext, useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom'; // Usamos NavLink para estilos activos
import { UserContext } from '../context/UserContext';
import DefaultAvatarIcon from './DefaultAvatarIcon'; // Importamos el icono por defecto

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isAuthenticated, user, logout, isLoading } = useContext(UserContext);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    useEffect(() => {
        setMenuOpen(false);
    }, [user]);

    // Componente interno para el avatar, que decide si mostrar la imagen o el icono
    const UserAvatar = () => (
        <div
            className="size-10 rounded-full cursor-pointer bg-gray-700 border-2 border-transparent hover:border-purple-500 transition-colors"
            onClick={toggleMenu}
        >
            {user.avatar ? (
                <div
                    className="h-full w-full bg-center bg-no-repeat bg-cover rounded-full"
                    style={{ backgroundImage: `url(${user.avatar})` }}
                />
            ) : (
                <DefaultAvatarIcon />
            )}
        </div>
    );

    const renderLinks = () => {
        if (isLoading) {
            return <div className="h-6 w-56 bg-gray-700 rounded animate-pulse"></div>;
        }

        const linkClasses = "px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors";
        const activeLinkClasses = "bg-gray-900 text-white";

        return (
            <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                    <>
                        <NavLink to="/user-home" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Inicio</NavLink>
                        <NavLink to="/news" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Noticias</NavLink>
                    </>
                ) : (
                    <>
                        <NavLink to="/login" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Iniciar Sesión</NavLink>
                        <NavLink to="/register" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>Registrarse</NavLink>
                    </>
                )}
            </div>
        );
    };

    return (
        <header className="sticky top-0 z-50 bg-[#111418]/80 backdrop-blur-sm border-b border-solid border-b-[#283039]">
            <nav className="container mx-auto flex items-center justify-between px-6 py-3">
                <Link to={isAuthenticated ? "/user-home" : "/"} className="flex items-center gap-3 text-white">
                    <div className="size-8 text-purple-500">
                    <img 
                            src={import.meta.env.VITE_IMAGE_LOGO} // Asegúrate de que este nombre coincida con tu archivo en la carpeta /public
                            alt="Logo de GameFlow" 
                            className="h-full w-full object-contain" 
                        />                    
                    </div>
                    <h2 className="text-xl font-bold tracking-tighter">GameFlow</h2>
                </Link>

                <div className="hidden md:flex items-center gap-4">
                    {renderLinks()}
                </div>

                <div className="flex items-center">
                    {!isLoading && isAuthenticated && user && (
                        <div className="relative">
                            <UserAvatar />
                            {menuOpen && (
                                <div className="absolute right-0 mt-2 w-56 origin-top-right bg-[#283039] rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                                    <div className="py-1">
                                        <div className="px-4 py-2 border-b border-gray-700">
                                            <p className="text-sm text-white font-semibold truncate">{user.username}</p>
                                            <p className="text-xs text-gray-400 truncate">{user.email}</p>
                                        </div>
                                        {user.admin && (
                                            <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-purple-400 hover:bg-gray-700">Panel de Admin</Link>
                                        )}
                                        <Link to="/user-settings" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Configuración</Link>
                                        <button
                                            onClick={logout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                                        >
                                            Cerrar sesión
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
// src/components/Navbar.jsx
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    // Obtenemos todo lo que necesitamos del contexto
    const { isAuthenticated, user, logout } = useContext(UserContext);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#283039] px-10 py-3 bg-[#111418]">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-4 text-white">
                    {/* ... SVG y título de GameFinder ... */}
                    <div className="size-4">
                        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" fill="currentColor"></path></svg>
                    </div>
                    <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">GameFinder</h2>
                </div>
                <div className="flex items-center gap-9">
                    {/* El renderizado condicional ahora depende del estado del contexto */}
                    {isAuthenticated ? (
                        <>
                            <Link className="text-white text-sm font-medium leading-normal" to="/user-home">Inicio</Link>
                                                        <Link className="text-white text-sm font-medium leading-normal" to="/news">Noticias</Link>
                            <Link className="text-white text-sm font-medium leading-normal" to="/user-settings">Perfil</Link>
                        </>
                    ) : (
                        <>
                            <Link className="text-white text-sm font-medium leading-normal" to="/login">Iniciar Sesión</Link>
                            <Link className="text-white text-sm font-medium leading-normal" to="/register">Registrarse</Link>
                        </>
                    )}
                </div>
            </div>
            <div className="relative flex flex-1 justify-end gap-8">
                {/* El avatar y el menú de usuario ahora dependen de 'isAuthenticated' y 'user' del contexto */}
                {isAuthenticated && user && (
                    <div>
                        <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 cursor-pointer"
                            style={{ backgroundImage: `url(${user.avatar})` }}
                            onClick={toggleMenu}
                        ></div>
                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-[#283039] rounded-lg shadow-lg z-20">
                                <Link to="/user-settings" className="block px-4 py-2 text-white hover:bg-[#111418]">
                                    Configuración del perfil
                                </Link>
                                <button
                                    className="block w-full text-left px-4 py-2 text-white hover:bg-[#111418]"
                                    onClick={logout} // <-- Usamos la función logout del contexto
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
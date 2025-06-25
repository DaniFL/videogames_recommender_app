// src/components/PublicRoute.jsx
import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
    const { isAuthenticated, isLoading } = useContext(UserContext);

    if (isLoading) {
        return <div className="bg-[#111418] min-h-screen text-white flex items-center justify-center">Cargando...</div>;
    }

    if (isAuthenticated) {
        // Si está autenticado, lo redirige a su página de inicio personal
        return <Navigate to="/user-home" replace />;
    }

    // Si no está autenticado, muestra el componente hijo (Home, Login, Register)
    return <Outlet />;
};

export default PublicRoute;
// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useContext(UserContext);

    if (isLoading) {
        // Muestra un loader mientras se verifica la sesión para evitar parpadeos
        return <div className="bg-[#111418] min-h-screen text-white flex items-center justify-center">Cargando...</div>;
    }

    if (!isAuthenticated) {
        // Si no está autenticado, lo redirige a la página de login
        return <Navigate to="/login" replace />;
    }

    // Si está autenticado, muestra el componente hijo (la página protegida)
    return <Outlet />;
};

export default ProtectedRoute;
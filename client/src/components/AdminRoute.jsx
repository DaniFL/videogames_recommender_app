// src/components/AdminRoute.jsx
import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    const { user, isAuthenticated, isLoading } = useContext(UserContext);

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    // Si está autenticado Y el campo 'admin' es true
    if (isAuthenticated && user.admin === true) {
        return <Outlet />; // Muestra el panel de admin
    }

    // Si no, lo redirige a su página de inicio normal
    return <Navigate to="/user-home" replace />;
};

export default AdminRoute;
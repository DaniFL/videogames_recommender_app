// src/context/UserContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) { return null; }
    });
    const [isLoading, setIsLoading] = useState(true);

    const verifyUser = useCallback(async () => {
        // Si no hay usuario en el estado inicial, no hacemos nada.
        // La cookie puede o no existir, pero no hay usuario logueado en esta sesión.
        // La verificación real ocurrirá cuando el usuario intente acceder a una ruta protegida.
        // Esto simplifica el arranque y evita llamadas innecesarias.
        setIsLoading(false);
    }, []);

    useEffect(() => {
        verifyUser();
    }, [verifyUser]);

    const login = async (email, password) => {
        const response = await api.post('/login', { email, password });
        if (response.data && response.data.user) {
            const userData = response.data.user;
            setUser(userData);
            // Guardamos el objeto de usuario completo en localStorage
            localStorage.setItem('user', JSON.stringify(userData));
        }
        return response;
    };

    const updateUser = (newUserData) => {
        setUser(newUserData);
        localStorage.setItem('user', JSON.stringify(newUserData));
        console.log("Contexto y localStorage actualizados con nuevos datos de usuario.");
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error("El logout falló, limpiando localmente de todos modos.", error);
        } finally {
            // Limpiamos tanto el estado como el localStorage
            setUser(null);
            localStorage.removeItem('user');
            // Eliminamos cualquier token viejo que pudiera haber quedado
            localStorage.removeItem('token'); 
        }
    };

    const contextValue = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser
    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};
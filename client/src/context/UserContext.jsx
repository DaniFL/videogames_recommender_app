// src/context/UserContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // Empezamos en estado de carga para verificar la sesión
    const [isLoading, setIsLoading] = useState(true);

    // Esta función se ejecutará UNA SOLA VEZ al cargar la aplicación.
    // Su trabajo es verificar si la cookie de sesión en el navegador es válida.
    const verifyUserSession = useCallback(async () => {
        try {
            // Hacemos una petición a una ruta protegida. Si la cookie es válida, funcionará.
            const response = await api.get('/user/profile');
            
            // Si la petición tiene éxito, el token es válido. Guardamos los datos frescos del usuario.
            if (response.data) {
                setUser(response.data);
                localStorage.setItem('user', JSON.stringify(response.data));
            }
        } catch (error) {
            // Si la petición falla (error 401/403), la cookie no es válida o no existe.
            // Nos aseguramos de limpiar cualquier dato de usuario obsoleto.
            console.log("No hay sesión activa o la cookie ha expirado.");
            setUser(null);
            localStorage.removeItem('user');
        } finally {
            // Sea cual sea el resultado, la verificación ha terminado.
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        verifyUserSession();
    }, [verifyUserSession]);


    // La función de login se mantiene igual, pero ahora actualiza localStorage
    const login = async (email, password) => {
        const response = await api.post('/login', { email, password });
        if (response.data && response.data.user) {
            const userData = response.data.user;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        }
        return response;
    };

    // La función de logout se mantiene igual
    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error("El logout falló, limpiando localmente de todos modos.", error);
        } finally {
            setUser(null);
            localStorage.removeItem('user');
        }
    };

    // La función updateUser también actualiza localStorage
    const updateUser = (newUserData) => {
        setUser(newUserData);
        localStorage.setItem('user', JSON.stringify(newUserData));
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
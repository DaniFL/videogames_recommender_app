// src/components/admin/StatsCards.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const StatCard = ({ title, value, isLoading }) => (
    <div className="bg-[#1b2127] p-6 rounded-lg shadow-lg">
        <h3 className="text-gray-400 text-sm font-medium uppercase">{title}</h3>
        {/* Mostramos un placeholder mientras carga para una mejor UX */}
        {isLoading ? (
            <div className="mt-2 h-9 w-16 bg-gray-700 rounded animate-pulse"></div>
        ) : (
            <p className="text-white text-3xl font-bold mt-2">{value}</p>
        )}
    </div>
);

const StatsCards = () => {
    // CORRECCIÓN: Inicializamos todos los valores esperados para evitar errores
    const [stats, setStats] = useState({ 
        totalUsers: 0, 
        totalGames: 0, 
        visitorsToday: 0 
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/admin/stats/overview');
                setStats(response.data);
            } catch (error) {
                console.error("Error al obtener las estadísticas generales:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Usuarios Totales" value={stats.totalUsers} isLoading={isLoading} />
            {/* CORRECCIÓN: Usamos el valor del estado 'stats.totalGames' */}
            <StatCard title="Juegos en DB" value={stats.totalGames} isLoading={isLoading} /> 
            <StatCard title="Reseñas Totales" value={"-"} isLoading={isLoading} /> {/* Placeholder */}
            <StatCard title="Visitantes Hoy" value={stats.visitorsToday} isLoading={isLoading} />
        </div>
    );
};

export default StatsCards;
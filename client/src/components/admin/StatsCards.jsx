// src/components/admin/StatsCards.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const StatCard = ({ title, value }) => (
    <div className="bg-[#1b2127] p-6 rounded-lg shadow-lg">
        <h3 className="text-gray-400 text-sm font-medium uppercase">{title}</h3>
        <p className="text-white text-3xl font-bold mt-2">{value}</p>
    </div>
);

const StatsCards = () => {
    const [stats, setStats] = useState({ totalUsers: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
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

    if (isLoading) {
        return <div className="text-white">Cargando estadísticas...</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Usuarios Totales" value={stats.totalUsers} />
            <StatCard title="Juegos en DB" value={"-"} /> 
            <StatCard title="Reseñas Totales" value={"-"} />
            <StatCard title="Visitantes Hoy" value={stats.visitorsToday} />
        </div>
    );
};

export default StatsCards;
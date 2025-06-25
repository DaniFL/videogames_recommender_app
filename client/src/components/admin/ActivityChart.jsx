// src/components/admin/ActivityChart.jsx
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import api from '../../services/api';

// Registramos todos los componentes de Chart.js
Chart.register(...registerables);

const ActivityChart = () => {
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const response = await api.get('/admin/stats/user-activity');
                const { registrations, logins } = response.data;

                // Procesamos los datos para el formato que necesita el gráfico
                const labels = registrations.map(r => new Date(r.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }));
                const registrationData = registrations.map(r => r.count);
                const loginData = logins.map(l => l.count);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Nuevos Registros',
                            data: registrationData,
                            borderColor: 'rgb(168, 85, 247)', // Púrpura
                            backgroundColor: 'rgba(168, 85, 247, 0.5)',
                            tension: 0.1
                        },
                        {
                            label: 'Inicios de Sesión',
                            data: loginData,
                            borderColor: 'rgb(59, 130, 246)', // Azul
                            backgroundColor: 'rgba(59, 130, 246, 0.5)',
                            tension: 0.1
                        }
                    ]
                });
            } catch (error) {
                console.error("Error al obtener la actividad de los usuarios:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchActivity();
    }, []);

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top', labels: { color: 'white' } },
            title: { display: true, text: 'Actividad de Usuarios (Últimos 30 días)', color: 'white', font: { size: 16 } }
        },
        scales: {
            x: { ticks: { color: 'white' } },
            y: { ticks: { color: 'white' } }
        }
    };

    if (isLoading) {
        return <div className="text-white">Cargando gráficos...</div>;
    }

    return (
        <div className="bg-[#1b2127] p-6 rounded-lg shadow-lg mt-8">
            {chartData && <Line options={options} data={chartData} />}
        </div>
    );
};

export default ActivityChart;
// src/pages/AdminDashboard.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import StatsCards from '../components/admin/StatsCards';
import ActivityChart from '../components/admin/ActivityChart';
import UsersTable from '../components/admin/UsersTable';
import ApiStatus from '../components/admin/ApiStatus';

const AdminDashboard = () => {
    return (
        <div className="min-h-screen bg-[#111418]">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-extrabold text-white mb-8">Panel de Administrador</h1>
                
                {/* Nueva sección de Estado de Servicios */}
                <ApiStatus />

                {/* Sección de Estadísticas Rápidas */}
                <div className="mt-8">
                    <StatsCards />
                </div>

                {/* Sección de Gráficos */}
                <ActivityChart />

                {/* Sección de Tabla de Usuarios */}
                <UsersTable />

            </main>
        </div>
    );
};

export default AdminDashboard;
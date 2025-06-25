// src/components/admin/ApiStatus.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ApiStatus = () => {
    const [statuses, setStatuses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStatuses = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/admin/health-check');
            setStatuses(response.data);
        } catch (error) {
            console.error("Error al verificar el estado de las APIs:", error);
            // Si la propia llamada falla, lo indicamos
            setStatuses([
                { name: 'Servicio de Verificación', status: 'Offline', error: 'No se pudo contactar al backend.' }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStatuses();
    }, []);

    const getStatusPill = (status) => {
        const isOnline = status === 'Online';
        const baseClasses = 'px-3 py-1 text-xs font-bold rounded-full';
        const onlineClasses = 'bg-green-900 text-green-300';
        const offlineClasses = 'bg-red-900 text-red-300';
        return (
            <span className={`${baseClasses} ${isOnline ? onlineClasses : offlineClasses}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="bg-[#1b2127] p-6 rounded-lg shadow-lg mt-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-white text-xl font-bold">Estado de los Servicios</h2>
                <button 
                    onClick={fetchStatuses} 
                    disabled={isLoading}
                    className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50"
                >
                    {isLoading ? 'Verificando...' : 'Re-verificar'}
                </button>
            </div>
            <div className="space-y-4">
                {isLoading ? (
                    <p className="text-gray-400">Realizando chequeo...</p>
                ) : (
                    statuses.map((service, index) => (
                        <div key={index} className="flex justify-between items-center bg-[#283039] p-4 rounded-lg">
                            <span className="text-white font-medium">{service.name}</span>
                            {getStatusPill(service.status)}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ApiStatus;
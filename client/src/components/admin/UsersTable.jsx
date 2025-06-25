// src/components/admin/UsersTable.jsx
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const UsersTable = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Función para cargar los usuarios
    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Función para cambiar el estado de bloqueo de un usuario
    const handleToggleBlock = async (userId, currentStatus) => {
        try {
            await api.put(`/admin/users/${userId}/status`, { isBlocked: !currentStatus });
            // Después de cambiar el estado, volvemos a cargar la lista para ver el cambio
            fetchUsers(); 
        } catch (error) {
            console.error("Error al cambiar el estado del usuario:", error);
            alert("No se pudo actualizar el usuario.");
        }
    };

    if (isLoading) {
        return <div className="text-white">Cargando tabla de usuarios...</div>;
    }

    return (
        <div className="bg-[#1b2127] p-6 rounded-lg shadow-lg mt-8">
            <h2 className="text-white text-xl font-bold mb-4">Gestión de Usuarios</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-[#283039]">
                        <tr>
                            <th scope="col" className="px-6 py-3">Username</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Fecha de Registro</th>
                            <th scope="col" className="px-6 py-3">Estado</th>
                            <th scope="col" className="px-6 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-gray-700 hover:bg-[#283039]">
                                <td className="px-6 py-4 font-medium text-white">{user.username}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.isBlocked ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`}>
                                        {user.isBlocked ? 'Bloqueado' : 'Activo'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleToggleBlock(user.id, user.isBlocked)}
                                        className={`px-3 py-1 rounded text-sm ${user.isBlocked ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}`}
                                    >
                                        {user.isBlocked ? 'Desbloquear' : 'Bloquear'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersTable;
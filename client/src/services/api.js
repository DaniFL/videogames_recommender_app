// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // Tu URL base del backend desde .env
    withCredentials: true // ¡LA MAGIA! Incluye las cookies en todas las peticiones
});

export default api;
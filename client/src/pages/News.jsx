// src/pages/News.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NewsCard from '../components/Newscard'; // Importamos nuestro nuevo componente

const News = () => {
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            setIsLoading(true);
            try {
                // Llamamos a nuestro endpoint del backend, que es seguro
                const response = await api.get('/news');
                setArticles(response.data.articles);
            } catch (err) {
                console.error("Error al obtener noticias:", err);
                setError("No se pudieron cargar las noticias. Inténtalo más tarde.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchNews();
    }, []);

    // Separamos el primer artículo para destacarlo
    const featuredArticle = articles.length > 0 ? articles[0] : null;
    const otherArticles = articles.length > 1 ? articles.slice(1) : [];

    const renderContent = () => {
        if (isLoading) {
            return <p className="text-center text-white text-xl mt-20">Cargando noticias...</p>;
        }
        if (error) {
            return <p className="text-center text-red-500 text-xl mt-20">{error}</p>;
        }
        if (articles.length === 0) {
            return <p className="text-center text-white text-xl mt-20">No se encontraron noticias recientes.</p>;
        }
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Artículo Destacado */}
                {featuredArticle && <NewsCard article={featuredArticle} isFeatured={true} />}
                
                {/* Resto de Noticias */}
                {otherArticles.map((article) => (
                    <NewsCard key={article.url} article={article} />
                ))}
            </div>
        );
    };

    return (
        <div
            className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#111418]"
            style={{ fontFamily: "Plus Jakarta Sans, Noto Sans, sans-serif" }}
        >
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-5xl font-extrabold text-white mb-12">Últimas Noticias</h1>
                {renderContent()}
            </main>
            <Footer />
        </div>
    );
};

export default News;
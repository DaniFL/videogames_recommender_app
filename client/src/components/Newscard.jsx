// src/components/NewsCard.jsx
import React from 'react';

const NewsCard = ({ article, isFeatured = false }) => {
    // Función para formatear la fecha
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    if (isFeatured) {
        return (
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="block col-span-1 md:col-span-2 lg:col-span-3 rounded-xl overflow-hidden relative text-white group">
                <img src={article.urlToImage} alt={article.title} className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                    <h2 className="text-3xl font-bold group-hover:text-purple-400 transition-colors">{article.title}</h2>
                    <p className="mt-2 text-gray-300 line-clamp-2">{article.description}</p>
                    <p className="text-xs mt-4 opacity-80">{article.source.name} &bull; {formatDate(article.publishedAt)}</p>
                </div>
            </a>
        );
    }

    return (
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="block bg-[#1b2127] rounded-xl overflow-hidden group">
            <img src={article.urlToImage} alt={article.title} className="w-full h-48 object-cover" />
            <div className="p-6">
                <p className="text-xs text-purple-400">{article.source.name}</p>
                <h3 className="mt-2 text-lg font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-2">{article.title}</h3>
                <p className="mt-2 text-sm text-gray-400 line-clamp-3">{article.description}</p>
            </div>
        </a>
    );
};

export default NewsCard;
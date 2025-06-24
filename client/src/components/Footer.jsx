// src/components/Footer.jsx

import React from 'react';

const Footer = () => (
    <footer className="bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4 py-8 text-center">
            <p>&copy; {new Date().getFullYear()} Tu Motor de Recomendación. Todos los derechos reservados.</p>
            <p className="mt-2 text-sm">Desarrollado con pasión y mucho café.</p>
            <div className="flex justify-center gap-6 mt-4">
                <a href="#" className="hover:text-white">Twitter</a>
                <a href="#" className="hover:text-white">GitHub</a>
                <a href="#" className="hover:text-white">LinkedIn</a>
            </div>
        </div>
    </footer>
);

export default Footer;
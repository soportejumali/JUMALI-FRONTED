import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserCatalog = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/books`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setBooks(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al cargar libros:', error);
            setLoading(false);
        }
    };

    const filteredBooks = books.filter(book => 
        book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.autor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Catálogo de Libros</h2>
            
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Buscar por título o autor..."
                    className="w-full p-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredBooks.map(book => (
                        <div key={book._id} className="bg-amber-50 p-6 rounded-lg shadow">
                            <h3 className="text-lg font-medium text-amber-800">{book.titulo}</h3>
                            <div className="mt-2 space-y-1">
                                <p className="text-gray-600">Autor: {book.autor}</p>
                                <p className="text-gray-600">Año: {book.año}</p>
                                <p className="text-gray-600">Editorial: {book.editorial}</p>
                                <p className={`mt-2 font-medium ${book.disponible ? 'text-green-600' : 'text-red-600'}`}>
                                    {book.disponible ? 'Disponible' : 'No disponible'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserCatalog;
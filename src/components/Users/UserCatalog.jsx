import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const UserCatalog = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        categoria: '',
        disponibilidad: 'disponible',
        ordenarPor: 'titulo'
    });

    useEffect(() => {
        fetchBooks();
    }, [filters]);

    const fetchBooks = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/books?estado=disponible`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );
            setBooks(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al cargar libros:', error);
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRequestLoan = async (bookId) => {
        try {
            const result = await Swal.fire({
                icon: 'question',
                title: '¿Solicitar préstamo?',
                text: '¿Deseas solicitar el préstamo de este libro?',
                showCancelButton: true,
                confirmButtonColor: '#d97706',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Sí, solicitar',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/loans`,
                    { libro: bookId },
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    }
                );

                Swal.fire({
                    icon: 'success',
                    title: '¡Préstamo solicitado!',
                    text: 'Tu solicitud de préstamo ha sido registrada exitosamente',
                    confirmButtonColor: '#d97706'
                });

                fetchBooks();
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'No se pudo solicitar el préstamo',
                confirmButtonColor: '#d97706'
            });
        }
    };

    const filteredBooks = books.filter(book => {
        const matchesSearch = 
            book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.editorial.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.tipoLiteratura.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = !filters.categoria || book.tipoLiteratura === filters.categoria;
        const matchesAvailability = filters.disponibilidad === 'todos' || 
            (filters.disponibilidad === 'disponible' && book.cantidad > 0) ||
            (filters.disponibilidad === 'prestado' && book.cantidad === 0);

        return matchesSearch && matchesCategory && matchesAvailability;
    }).sort((a, b) => {
        switch (filters.ordenarPor) {
            case 'titulo':
                return a.titulo.localeCompare(b.titulo);
            case 'autor':
                return a.autor.localeCompare(b.autor);
            case 'año':
                return b.año - a.año;
            default:
                return 0;
        }
    });

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Catálogo de Libros</h2>
                </div>

                <div className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Buscar por título, autor, editorial o tipo..."
                            className="w-full p-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            name="categoria"
                            value={filters.categoria}
                            onChange={handleFilterChange}
                            className="p-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                            <option value="">Todas las categorías</option>
                            <option value="Ficción">Ficción</option>
                            <option value="No Ficción">No Ficción</option>
                            <option value="Ciencia">Ciencia</option>
                            <option value="Historia">Historia</option>
                            <option value="Biografía">Biografía</option>
                        </select>
                        <select
                            name="disponibilidad"
                            value={filters.disponibilidad}
                            onChange={handleFilterChange}
                            className="p-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                            <option value="todos">Todos</option>
                            <option value="disponible">Disponibles</option>
                            <option value="prestado">En préstamo</option>
                        </select>
                        <select
                            name="ordenarPor"
                            value={filters.ordenarPor}
                            onChange={handleFilterChange}
                            className="p-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                            <option value="titulo">Ordenar por título</option>
                            <option value="autor">Ordenar por autor</option>
                            <option value="año">Ordenar por año</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <p>Cargando...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredBooks.map(book => (
                            <div key={book._id} className="bg-amber-50 p-6 rounded-lg shadow">
                                {book.foto && (
                                    <img
                                        src={book.foto}
                                        alt={book.titulo}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                )}
                                <h3 className="text-lg font-medium text-amber-800">{book.titulo}</h3>
                                <div className="mt-2 space-y-1">
                                    <p className="text-gray-600">Autor: {book.autor}</p>
                                    <p className="text-gray-600">Año: {book.año}</p>
                                    <p className="text-gray-600">Editorial: {book.editorial}</p>
                                    <p className="text-gray-600">Tipo: {book.tipoLiteratura}</p>
                                    <p className="text-gray-600">Ejemplares disponibles: {book.cantidad}</p>
                                    <p className={`text-sm font-medium ${
                                        book.cantidad > 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {book.cantidad > 0 ? 'Disponible' : 'No disponible'}
                                    </p>
                                </div>
                                <div className="mt-4">
                                    <button
                                        onClick={() => handleRequestLoan(book._id)}
                                        disabled={book.cantidad === 0}
                                        className={`w-full px-4 py-2 rounded-lg ${
                                            book.cantidad > 0
                                                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                    >
                                        {book.cantidad > 0 ? 'Solicitar Préstamo' : 'No Disponible'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserCatalog;
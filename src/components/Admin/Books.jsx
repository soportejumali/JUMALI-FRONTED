import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [activeTab, setActiveTab] = useState('disponible');
  const [filters, setFilters] = useState({
    categoria: '',
    disponibilidad: 'todos',
    ordenarPor: 'titulo'
  });
  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    año: '',
    editorial: '',
    tipoLiteratura: '',
    foto: null,
    cantidad: 1
  });

  useEffect(() => {
    fetchBooks();
  }, [activeTab, filters]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/books?estado=${activeTab}`,
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

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'foto') {
      setFormData(prev => ({ ...prev, foto: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Crear un objeto con los datos del formulario
      const bookData = {
        titulo: formData.titulo,
        autor: formData.autor,
        año: parseInt(formData.año),
        editorial: formData.editorial,
        tipoLiteratura: formData.tipoLiteratura,
        cantidad: parseInt(formData.cantidad),
        foto: '' // Por ahora lo dejamos vacío
      };

      // Asegurarse de que todos los campos requeridos estén presentes
      if (!bookData.titulo || !bookData.autor || !bookData.año || 
          !bookData.editorial || !bookData.tipoLiteratura || !bookData.cantidad) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Todos los campos son obligatorios',
          confirmButtonColor: '#d97706'
        });
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/books`,
        bookData,
        {
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      Swal.fire({
        icon: 'success',
        title: '¡Libro agregado!',
        text: 'El libro ha sido registrado exitosamente',
        confirmButtonColor: '#d97706'
      });

      setShowAddModal(false);
      setFormData({
        titulo: '',
        autor: '',
        año: '',
        editorial: '',
        tipoLiteratura: '',
        cantidad: 1,
        foto: null
      });
      fetchBooks();
    } catch (error) {
      console.error('Error completo:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo agregar el libro',
        confirmButtonColor: '#d97706'
      });
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const bookData = {
        titulo: formData.titulo,
        autor: formData.autor,
        año: parseInt(formData.año),
        editorial: formData.editorial,
        tipoLiteratura: formData.tipoLiteratura,
        cantidad: parseInt(formData.cantidad),
        foto: formData.foto || ''
      };

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/books/${selectedBook._id}`,
        bookData,
        {
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      Swal.fire({
        icon: 'success',
        title: '¡Libro actualizado!',
        text: 'El libro ha sido actualizado exitosamente',
        confirmButtonColor: '#d97706'
      });

      setShowEditModal(false);
      setSelectedBook(null);
      fetchBooks();
    } catch (error) {
      console.error('Error al actualizar:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo actualizar el libro',
        confirmButtonColor: '#d97706'
      });
    }
  };

  const handleDelete = async (bookId) => {
    try {
      const result = await Swal.fire({
        icon: 'warning',
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        showCancelButton: true,
        confirmButtonColor: '#d97706',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/books/${bookId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        Swal.fire({
          icon: 'success',
          title: '¡Libro eliminado!',
          text: 'El libro ha sido eliminado exitosamente',
          confirmButtonColor: '#d97706'
        });

        fetchBooks();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo eliminar el libro',
        confirmButtonColor: '#d97706'
      });
    }
  };

  const handleRestore = async (bookId) => {
    try {
      const result = await Swal.fire({
        icon: 'question',
        title: '¿Restaurar libro?',
        text: '¿Deseas restaurar este libro?',
        showCancelButton: true,
        confirmButtonColor: '#d97706',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Sí, restaurar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/books/${bookId}/restore`,
          {},
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );

        Swal.fire({
          icon: 'success',
          title: '¡Libro restaurado!',
          text: 'El libro ha sido restaurado exitosamente',
          confirmButtonColor: '#d97706'
        });

        fetchBooks();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo restaurar el libro',
        confirmButtonColor: '#d97706'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Gestión de Libros</h2>
          {activeTab === 'disponible' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white px-4 py-2 rounded-lg"
            >
              Agregar Libro
            </button>
          )}
        </div>

        <div className="mb-6">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setActiveTab('disponible')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'disponible'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Libros Disponibles
            </button>
            <button
              onClick={() => setActiveTab('eliminado')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'eliminado'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Libros Eliminados
            </button>
          </div>

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
                  <p className="text-gray-600">Ejemplares: {book.cantidad}</p>
                  <p className={`text-sm font-medium ${
                    book.cantidad > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {book.cantidad > 0 ? 'Disponible' : 'No disponible'}
                  </p>
                </div>
                <div className="mt-4 flex space-x-2">
                  {activeTab === 'disponible' ? (
                    <>
                      <button
                        onClick={() => {
                          setSelectedBook(book);
                          setFormData({
                            titulo: book.titulo,
                            autor: book.autor,
                            año: book.año,
                            editorial: book.editorial,
                            tipoLiteratura: book.tipoLiteratura,
                            cantidad: book.cantidad,
                            foto: null
                          });
                          setShowEditModal(true);
                        }}
                        className="bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Eliminar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleRestore(book._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Restaurar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para agregar libro */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Agregar Nuevo Libro</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Título</label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Autor</label>
                <input
                  type="text"
                  name="autor"
                  value={formData.autor}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Año</label>
                <input
                  type="number"
                  name="año"
                  value={formData.año}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Editorial</label>
                <input
                  type="text"
                  name="editorial"
                  value={formData.editorial}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo de Literatura</label>
                <input
                  type="text"
                  name="tipoLiteratura"
                  value={formData.tipoLiteratura}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cantidad de Ejemplares</label>
                <input
                  type="number"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleInputChange}
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Foto</label>
                <input
                  type="file"
                  name="foto"
                  onChange={handleInputChange}
                  accept="image/*"
                  className="mt-1 block w-full"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-amber-600 rounded-md hover:bg-amber-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para editar libro */}
      {showEditModal && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Editar Libro</h3>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Título</label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Autor</label>
                <input
                  type="text"
                  name="autor"
                  value={formData.autor}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Año</label>
                <input
                  type="number"
                  name="año"
                  value={formData.año}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Editorial</label>
                <input
                  type="text"
                  name="editorial"
                  value={formData.editorial}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo de Literatura</label>
                <input
                  type="text"
                  name="tipoLiteratura"
                  value={formData.tipoLiteratura}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cantidad de Ejemplares</label>
                <input
                  type="number"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleInputChange}
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Foto</label>
                <input
                  type="file"
                  name="foto"
                  onChange={handleInputChange}
                  accept="image/*"
                  className="mt-1 block w-full"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedBook(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-amber-600 rounded-md hover:bg-amber-700"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;
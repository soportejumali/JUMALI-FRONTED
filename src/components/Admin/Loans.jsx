import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    libroId: '',
    usuarioId: '',
    fechaPrestamo: '',
    fechaDevolucion: ''
  });

  useEffect(() => {
    fetchLoans();
    fetchBooks();
    fetchUsers();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/loans`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setLoans(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar préstamos:', error);
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/books`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBooks(response.data);
    } catch (error) {
      console.error('Error al cargar libros:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/loans`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      Swal.fire({
        icon: 'success',
        title: '¡Préstamo registrado!',
        text: 'El préstamo ha sido registrado exitosamente',
        confirmButtonColor: '#d97706'
      });

      setShowAddModal(false);
      setFormData({
        libroId: '',
        usuarioId: '',
        fechaPrestamo: '',
        fechaDevolucion: ''
      });
      fetchLoans();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo registrar el préstamo',
        confirmButtonColor: '#d97706'
      });
    }
  };

  const handleReturn = async (loanId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/loans/${loanId}/return`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      Swal.fire({
        icon: 'success',
        title: '¡Libro devuelto!',
        text: 'El libro ha sido devuelto exitosamente',
        confirmButtonColor: '#d97706'
      });

      fetchLoans();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo procesar la devolución',
        confirmButtonColor: '#d97706'
      });
    }
  };

  const filteredLoans = loans.filter(loan =>
    loan.libro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.usuario.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Gestión de Préstamos</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white px-4 py-2 rounded-lg"
          >
            Nuevo Préstamo
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por libro o usuario..."
            className="w-full p-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Cargando...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Libro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Préstamo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Devolución
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLoans.map(loan => (
                  <tr key={loan._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{loan.libro.titulo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{loan.usuario.nombreCompleto}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(loan.fechaPrestamo).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(loan.fechaDevolucion).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        loan.devuelto ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {loan.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {!loan.devuelto && (
                        <button
                          onClick={() => handleReturn(loan._id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Devolver
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal para nuevo préstamo */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Nuevo Préstamo</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Libro</label>
                <select
                  name="libroId"
                  value={formData.libroId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  required
                >
                  <option value="">Seleccione un libro</option>
                  {books.map(book => (
                    <option key={book._id} value={book._id}>
                      {book.titulo}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Usuario</label>
                <select
                  name="usuarioId"
                  value={formData.usuarioId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  required
                >
                  <option value="">Seleccione un usuario</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.nombreCompleto}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha de Préstamo</label>
                <input
                  type="date"
                  name="fechaPrestamo"
                  value={formData.fechaPrestamo}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha de Devolución</label>
                <input
                  type="date"
                  name="fechaDevolucion"
                  value={formData.fechaDevolucion}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  required
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
    </div>
  );
};

export default Loans;
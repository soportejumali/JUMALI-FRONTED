import { useState, useEffect } from 'react';
import axios from 'axios';

const AllowedUsers = () => {
  const [identifier, setIdentifier] = useState('');
  const [type, setType] = useState('email');
  const [allowedUsers, setAllowedUsers] = useState({ emails: [], identifications: [] });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchAllowedUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/allowed-users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAllowedUsers(response.data);
    } catch (error) {
      setError('Error al cargar usuarios permitidos');
    }
  };

  useEffect(() => {
    fetchAllowedUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/allowed-users`,
        { identifier, type },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      setSuccess('Usuario permitido agregado correctamente');
      setIdentifier('');
      fetchAllowedUsers();
    } catch (error) {
      setError('Error al agregar usuario permitido');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Agregar Usuario Permitido</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-amber-500 focus:border-amber-500 p-2.5"
            >
              <option value="email">Correo</option>
              <option value="identification">Cédula</option>
            </select>
            
            <input
              type={type === 'email' ? 'email' : 'text'}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={type === 'email' ? 'Correo electrónico' : 'Número de cédula'}
              className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-amber-500 focus:border-amber-500 p-2.5"
              required
            />
            
            <button
              type="submit"
              className="bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white px-4 py-2 rounded-lg"
            >
              Agregar
            </button>
          </div>
        </form>

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Usuarios Permitidos por Correo</h3>
          <div className="space-y-2">
            {allowedUsers.emails.map((email, index) => (
              <div key={index} className="p-2 bg-amber-50 rounded-lg">
                {email}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Usuarios Permitidos por Cédula</h3>
          <div className="space-y-2">
            {allowedUsers.identifications.map((id, index) => (
              <div key={index} className="p-2 bg-amber-50 rounded-lg">
                {id}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllowedUsers;
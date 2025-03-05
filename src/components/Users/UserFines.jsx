import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserFines = () => {
    const [fines, setFines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserFines();
    }, []);

    const fetchUserFines = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/fines/user`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setFines(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al cargar multas:', error);
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Mis Multas</h2>
            
            {loading ? (
                <p>Cargando...</p>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {fines.map(fine => (
                        <div key={fine._id} className="bg-amber-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-amber-800">Multa por: {fine.libro.titulo}</h3>
                            <p className="text-amber-600">Monto: ${fine.monto}</p>
                            <p className="text-amber-600">Fecha: {new Date(fine.fecha).toLocaleDateString()}</p>
                            <p className={`mt-2 ${fine.pagado ? 'text-green-600' : 'text-red-600'}`}>
                                {fine.pagado ? 'Pagado' : 'Pendiente'}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserFines;
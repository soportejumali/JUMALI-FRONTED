import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserLoans = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserLoans();
    }, []);

    const fetchUserLoans = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/loans/user`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setLoans(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error al cargar préstamos:', error);
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Mis Préstamos</h2>
            
            {loading ? (
                <p>Cargando...</p>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {loans.map(loan => (
                        <div key={loan._id} className="bg-amber-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-amber-800">{loan.libro.titulo}</h3>
                            <p className="text-amber-600">Fecha de préstamo: {new Date(loan.fechaPrestamo).toLocaleDateString()}</p>
                            <p className="text-amber-600">Fecha de devolución: {new Date(loan.fechaDevolucion).toLocaleDateString()}</p>
                            <p className={`mt-2 ${new Date(loan.fechaDevolucion) > new Date() ? 'text-green-600' : 'text-red-600'}`}>
                                {new Date(loan.fechaDevolucion) > new Date() ? 'En tiempo' : 'Atrasado'}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserLoans;
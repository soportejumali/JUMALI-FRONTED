import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const UserLoans = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
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

    const handleReturn = async (loanId) => {
        try {
            const result = await Swal.fire({
                icon: 'question',
                title: '¿Devolver libro?',
                text: '¿Deseas devolver este libro?',
                showCancelButton: true,
                confirmButtonColor: '#d97706',
                cancelButtonColor: '#6b7280',
                confirmButtonText: 'Sí, devolver',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                const response = await axios.put(
                    `${import.meta.env.VITE_BACKEND_URL}/api/loans/${loanId}/return`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    }
                );

                if (response.data.diasRetraso > 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: '¡Libro devuelto con retraso!',
                        text: `Has devuelto el libro con ${response.data.diasRetraso} días de retraso. Se te ha aplicado una multa de $${response.data.multa}`,
                        confirmButtonColor: '#d97706'
                    });
                } else {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Libro devuelto!',
                        text: 'El libro ha sido devuelto exitosamente',
                        confirmButtonColor: '#d97706'
                    });
                }

                fetchLoans();
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'No se pudo devolver el libro',
                confirmButtonColor: '#d97706'
            });
        }
    };

    const getStatusColor = (estado) => {
        switch (estado) {
            case 'activo':
                return 'bg-green-100 text-green-800';
            case 'devuelto':
                return 'bg-blue-100 text-blue-800';
            case 'vencido':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Mis Préstamos</h2>
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
                                        Código
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
                                {loans.map(loan => (
                                    <tr key={loan._id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {loan.libro.foto && (
                                                    <img
                                                        src={loan.libro.foto}
                                                        alt={loan.libro.titulo}
                                                        className="h-10 w-10 rounded-full object-cover mr-3"
                                                    />
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{loan.libro.titulo}</div>
                                                    <div className="text-sm text-gray-500">{loan.libro.autor}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{loan.copia.codigo}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{formatDate(loan.fechaPrestamo)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{formatDate(loan.fechaDevolucion)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(loan.estado)}`}>
                                                {loan.estado.charAt(0).toUpperCase() + loan.estado.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {loan.estado === 'activo' && (
                                                <button
                                                    onClick={() => handleReturn(loan._id)}
                                                    className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded"
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
        </div>
    );
};

export default UserLoans;
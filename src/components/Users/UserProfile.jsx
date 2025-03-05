import React from 'react';

const UserProfile = () => {
    const userInfo = {
        nombreCompleto: localStorage.getItem('nombreCompleto'),
        email: localStorage.getItem('email'),
        cedula: localStorage.getItem('cedula'),
        telefono: localStorage.getItem('telefono')
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Mi Perfil</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                <div className="bg-amber-50 p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Nombre Completo</h3>
                    <p className="text-xl font-semibold text-gray-800">{userInfo.nombreCompleto}</p>
                </div>
                
                <div className="bg-amber-50 p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Correo Electrónico</h3>
                    <p className="text-xl font-semibold text-gray-800">{userInfo.email}</p>
                </div>
                
                <div className="bg-amber-50 p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Cédula</h3>
                    <p className="text-xl font-semibold text-gray-800">{userInfo.cedula}</p>
                </div>
                
                <div className="bg-amber-50 p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Teléfono</h3>
                    <p className="text-xl font-semibold text-gray-800">{userInfo.telefono}</p>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
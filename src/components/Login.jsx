import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
                username,
                password,
            });
            const { nombreCompleto, email, role, token } = response.data;
            localStorage.setItem('nombreCompleto', nombreCompleto);
            localStorage.setItem('email', email);
            localStorage.setItem('role', role);
            localStorage.setItem('token', token);
            if (role === 'administrador') {
                navigate('/admin/dashboard');
            } else {
                navigate('/usuario/perfil');
            }
        } catch (error) {
            setError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (formData) => {
        try {
            // Primero verificamos si el usuario está permitido
            try {
                const checkResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/check-allowed`, {
                    email: formData.email,
                    cedula: formData.cedula
                });

                // Si está permitido, procedemos con el registro
                const registerResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, formData);
                
                Swal.fire({
                    icon: 'success',
                    title: '¡Registro exitoso!',
                    text: 'Por favor, inicia sesión con tus credenciales',
                    confirmButtonColor: '#d97706'
                });

            } catch (checkError) {
                // Específicamente manejamos el error 403 de usuario no permitido
                if (checkError.response?.status === 403) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Acceso No Permitido',
                        text: 'No te encuentras en la lista de usuarios permitidos del sistema. Por favor, contacta a soportebibliotecajumali@gmail.com exponiendo tu caso.',
                        confirmButtonColor: '#d97706'
                    });
                    return;
                }
                throw checkError; // Si es otro tipo de error, lo propagamos
            }

        } catch (error) {
            let errorMessage = 'Error al procesar el registro';
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            Swal.fire({
                icon: 'error',
                title: 'Error en el registro',
                text: errorMessage,
                confirmButtonColor: '#d97706'
            });
        }
    };

    const showRegistrationModal = () => {
        Swal.fire({
            title: 'Registro de Usuario',
            html: `
                    <div class="grid text-sm grid-cols-2 gap-4">
                    
                    <div>   
                        <input id="nombreCompleto" class="swal2-input" placeholder="Nombre completo">
                    </div>
                    <div>
                        <input id="email" type="email" class="swal2-input" placeholder="Correo electrónico">
                    </div>
                    <div>
                        <input id="cedula" class="swal2-input" placeholder="Cédula">
                    </div>
                    <div>
                        <input id="telefono" class="swal2-input" placeholder="Teléfono">
                    </div>
                    <div class="col-span-2">
                        <input id="password" type="password" class="swal2-input" placeholder="Contraseña">
                    </div>
                </div>
            `,
            confirmButtonText: 'Registrarse',
            confirmButtonColor: '#d97706',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            cancelButtonColor: '#6b7280',
            focusConfirm: false,
            customClass: {
                container: 'registration-modal'
            },
            preConfirm: () => {
                const formData = {
                    nombreCompleto: document.getElementById('nombreCompleto').value,
                    email: document.getElementById('email').value,
                    cedula: document.getElementById('cedula').value,
                    telefono: document.getElementById('telefono').value,
                    password: document.getElementById('password').value
                };

                // Validación básica
                for (const [key, value] of Object.entries(formData)) {
                    if (!value) {
                        Swal.showValidationMessage(`Por favor, completa el campo ${key}`);
                        return false;
                    }
                }

                return formData;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                handleRegister(result.value);
            }
        });
    };

    return (
        <div className="min-h-screen max-h-24 flex items-center justify-center relative bg-gradient-to-br from-amber-50 to-orange-100 p-4" 
            style={{ 
                backgroundImage: "url('/fondo.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            }}>
            <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
            
            <div className="w-full max-w-sm relative z-10">
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                    {/* Encabezado */}
                    <div className="bg-gradient-to-r text-center from-amber-700 to-orange-800 p-6">
                        <div className="mb-3">
                            <svg className="w-12 h-12 mx-auto text-amber-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white">Sistema Bibliotecario</h2>
                        <h2 className="text-2xl font-bold text-white">JUMALI</h2>
                        <p className="text-amber-100 mt-1 text-sm">Gestión y Control de Recursos</p>
                    </div>
                    
                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="p-6">
                        {error && (
                            <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                                {error}
                            </div>
                        )}
                        
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-semibold mb-2">
                                Nombre de Usuario
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaUser className="text-amber-600" />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="pl-10 w-full py-3 px-4 bg-amber-50/50 text-gray-700 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-200"
                                    placeholder="Ingresa tu usuario"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-semibold mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaLock className="text-amber-600" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 w-full py-3 px-4 bg-amber-50/50 text-gray-700 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition duration-200"
                                    placeholder="Ingresa tu contraseña"
                                    required
                                />
                            </div>
                        </div>

                        
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Procesando...' : 'Iniciar Sesión'}
                        </button>

                        <div className="mt-4 text-center">
                        <div className="text-xs mb-3">
                                <a href="#" className="font-medium text-amber-700 hover:text-amber-600 transition duration-200">
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </div>
                            <button
                                type="button"
                                onClick={showRegistrationModal}
                                className="text-amber-700 hover:text-amber-600 text-xs font-medium  transition duration-200"
                            >
                                ¿No tienes cuenta? Regístrate
                            </button>
                        </div>
                    </form>
                    
                    {/* Pie de página */}
                    <div className="px-6 py-4 bg-amber-50/50 border-t border-amber-100">
                        <p className="text-xs text-gray-600 text-center">
                            © 2025 Sistema Bibliotecario
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
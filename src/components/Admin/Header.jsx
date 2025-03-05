import { FaUser, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const nombreCompleto = localStorage.getItem('nombreCompleto');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="flex items-center justify-between h-16 px-6">
        <button 
          onClick={toggleSidebar}
          className="text-amber-700 hover:text-amber-900 transition-colors duration-200"
        >
          <FaBars className="h-6 w-6" />
        </button>

        <h1 className="text-xl font-semibold text-amber-800">Panel Administrativo</h1>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FaUser className="text-amber-600" />
            <span className="text-gray-700">{nombreCompleto}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 shadow-md hover:shadow-lg"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
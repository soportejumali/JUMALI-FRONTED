import { Link, useLocation } from 'react-router-dom';
import { FaChartBar, FaBook, FaUsers, FaFileAlt, FaMoneyBill, FaDatabase } from 'react-icons/fa';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  
  const menuItems = [
    { title: 'Dashboard', icon: <FaChartBar />, path: '/admin/dashboard' },
    { title: 'Gestión de Libros', icon: <FaBook />, path: '/admin/books' },
    { title: 'Usuarios', icon: <FaUsers />, path: '/admin/users' },
    { title: 'Préstamos', icon: <FaFileAlt />, path: '/admin/loans' },
    { title: 'Multas', icon: <FaMoneyBill />, path: '/admin/fines' },
    { title: 'Usuarios Permitidos', icon: <FaDatabase />, path: '/admin/allowed-users' }
  ];

  const handleMenuClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        bg-gradient-to-b from-amber-700 to-orange-800
      `}>
        <div className="h-16 flex items-center justify-center border-b border-amber-600">
          <h2 className="text-xl font-bold text-white">Biblioteca JUMALI</h2>
        </div>

        <nav className="mt-6">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={handleMenuClick}
              className={`
                flex items-center px-6 py-3 text-white
                ${location.pathname === item.path ? 'bg-amber-800' : 'hover:bg-amber-600'}
                transition duration-200
              `}
            >
              <span className="mr-3">{item.icon}</span>
              {item.title}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
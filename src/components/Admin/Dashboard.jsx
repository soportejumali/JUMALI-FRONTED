const Dashboard = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tarjetas de estadísticas */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Libros</h3>
          <p className="text-2xl font-semibold">150</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Préstamos Activos</h3>
          <p className="text-2xl font-semibold">23</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Usuarios Registrados</h3>
          <p className="text-2xl font-semibold">89</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Multas Pendientes</h3>
          <p className="text-2xl font-semibold">5</p>
        </div>
      </div>
    );
  };
  
  export default Dashboard;
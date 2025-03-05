const Books = () => {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Gestión de Libros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Contenido pendiente */}
          <div className="bg-amber-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-amber-800">Próximamente</h3>
            <p className="text-amber-600">Gestión de catálogo de libros</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default Books;
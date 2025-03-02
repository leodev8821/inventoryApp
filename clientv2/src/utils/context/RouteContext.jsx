import React, { createContext, useState } from 'react';

// Creamos el contexto
const RouteContext = createContext();

// Creamos el proveedor del contexto
const RouteProvider = ({ children }) => {
  const [type, setType] = useState(); // Estado inicial

  // Función para cambiar el tipo de vista
  const toggleType = (link) => {
    setType(link);
  };

  return (
    <RouteContext.Provider value={{ type, toggleType }}>
      {children}
    </RouteContext.Provider>
  );
};

export { RouteProvider, RouteContext };

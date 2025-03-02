import React, { createContext, useState } from 'react';

// Creamos el contexto
const DatosContext = createContext();

// Creamos el proveedor del contexto
const DatosProvider = ({ children }) => {
  const [datos, setDatos] = useState({
    username: null,
    email: null,
    first_name: null,
    direccion: null
  }); // Estado inicial

  // Función para cambiar el tipo de vista
  const toggleDatos = async (info) => {
    setDatos(info);
  };

  return (
    <DatosContext.Provider value={{ datos, toggleDatos }}>
      {children}
    </DatosContext.Provider>
  );
};

export { DatosProvider, DatosContext };
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const {nombreUsuario, setNombreUsuario} = useState({ nombre: ''});
  return (
    <UserContext.Provider value={{ nombreUsuario, setNombreUsuario }}>
      {children}
    </UserContext.Provider>
  );
};


// export const useUserContext = () => useContext(UserContext);

export { UserProvider, UserContext };


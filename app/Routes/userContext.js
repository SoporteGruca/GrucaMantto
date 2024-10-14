import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  console.log('nombreUsuario en UseStates: ',  nombreUsuario);
  
  return (
    <UserContext.Provider value={{ nombreUsuario, setNombreUsuario }}>
      {children}
    </UserContext.Provider>
  );
};

// export { UserProvider, UserContext };
export const useUserContext = () => useContext(UserContext);
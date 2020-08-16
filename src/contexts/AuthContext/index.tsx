import React, { createContext, useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import Usuario from '../../types/Usuario';

interface AuthContextValue {
  usuario: Usuario | undefined,
  logout: () => void,
  setUsuario: Dispatch<SetStateAction<Usuario | undefined>>
}

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

export const AuthProvider: React.FC = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario>();

  const logout = useCallback(() => {
    localStorage.removeItem("tokenUsuario");
    setUsuario({} as Usuario);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("tokenUsuario");
    if (token && !usuario) {
      setUsuario({ token } as Usuario);
    }
  }, [usuario])

  return (
    <AuthContext.Provider value={{ usuario, logout, setUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
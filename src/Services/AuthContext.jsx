import React, { createContext, useEffect, useState } from 'react';
import AuthService from './AuthService';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!AuthService.isTokenExpired());

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAuthenticated(!AuthService.isTokenExpired());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

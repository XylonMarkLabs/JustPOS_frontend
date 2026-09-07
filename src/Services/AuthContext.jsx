import React, { createContext, useEffect, useState } from 'react';
import AuthService from './AuthService';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!AuthService.isTokenExpired());
  const [businessData, setBusinessData] = useState(JSON.parse(localStorage.getItem('businessData')));
  const [isBusinessSelected, setIsBusinessSelected] = useState(!!localStorage.getItem('businessId'));

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
    setBusinessData(null);
    setIsBusinessSelected(false);
  };

  const selectBusiness = (business) => {
    setBusinessData(business);
    setIsBusinessSelected(true);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      login, 
      logout, 
      selectBusiness,
      businessData,
      isBusinessSelected 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

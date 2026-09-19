import React, { createContext, useEffect, useState } from 'react';
import ApiCall from './ApiCall';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [businessData, setBusinessData] = useState(JSON.parse(localStorage.getItem('businessData')));
  const [isBusinessSelected, setIsBusinessSelected] = useState(!!localStorage.getItem('businessId'));

  useEffect(() => {
    const checkSession = async () => {
      try {
        const userData = await ApiCall.user.getUserData();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await ApiCall.user.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }

    localStorage.removeItem('user');
    setUser(null);
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
      authLoading,
      user,
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
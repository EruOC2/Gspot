import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import decodeToken from '../app/utils/decodeToken'; // Ajusta si tu estructura es diferente

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const loadUser = async () => {
    setChecking(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const decoded = decodeToken(token);
        if (decoded?.exp * 1000 > Date.now()) {
          setUser(decoded);
        } else {
          await AsyncStorage.removeItem('token');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error verificando token:', error);
      setUser(null);
    } finally {
      setChecking(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, checking, logout, refresh: loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

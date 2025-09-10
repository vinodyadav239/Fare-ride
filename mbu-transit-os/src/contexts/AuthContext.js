import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await api.login(credentials);
      
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        return { success: true, user: response.user };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.register(userData);
      
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        return { success: true, user: response.user };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const isStudent = () => {
    return user && user.userType === 'student';
  };

  const isDriver = () => {
    return user && user.userType === 'driver';
  };

  const isAdmin = () => {
    return user && user.userType === 'admin';
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    isStudent,
    isDriver,
    isAdmin
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};

export default AuthContext;

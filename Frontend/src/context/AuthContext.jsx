import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      // Login endpoint expects form data
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axiosClient.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token } = response.data;
      
      // Store token
      localStorage.setItem('token', access_token);
      
      // Fetch user info (we'll need to get this from the token or create a /me endpoint)
      // For now, we'll store a basic user object
      const userData = {
        username: username,
        email: username.includes('@') ? username : null,
      };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const signup = async (userData) => {
    try {
      // Prepare registration data - convert empty full_name to null
      const registrationData = {
        email: userData.email,
        username: userData.username,
        password: userData.password,
        full_name: userData.full_name && userData.full_name.trim() !== '' 
          ? userData.full_name.trim() 
          : null,
      };

      const response = await axiosClient.post('/auth/register', registrationData);
      
      // Auto-login after signup
      const loginResult = await login(userData.email, userData.password);
      
      if (loginResult.success) {
        // Update user with full data from registration
        const fullUserData = {
          id: response.data.id,
          email: response.data.email,
          username: response.data.username,
          full_name: response.data.full_name || null,
        };
        localStorage.setItem('user', JSON.stringify(fullUserData));
        setUser(fullUserData);
        toast.success('Account created successfully!');
        return { success: true };
      }
      
      return loginResult;
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response);
      console.error('Error request:', error.request);
      
      let message = 'Registration failed';
      
      if (error.response) {
        // Server responded with error
        message = error.response.data?.detail || error.response.data?.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request made but no response
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        message = `No response from server at ${apiUrl}. Please check if the backend is running on port 8000.`;
      } else {
        // Error setting up request
        message = error.message || 'Failed to send registration request';
      }
      
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


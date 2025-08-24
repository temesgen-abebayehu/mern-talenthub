// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getUser, logoutUser, resetPassword as resetPasswordApi, updatePassword } from '../services/authService';

interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  [key: string]: any;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  register: (userData: Record<string, any>) => Promise<{ success: boolean; data?: any; error?: string }>;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; data?: any; error?: string }>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  resetPassword: (resetData: { token: string; password: string }) => Promise<{ success: boolean; data?: any; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const userData = await getUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch current user', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Record<string, any>) => {
    try {
      const user = await registerUser(userData);
      setUser(user);
      return { success: true, data: user };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const user = await loginUser(credentials);
      setUser(user);
      return { success: true, data: user };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await resetPasswordApi(email);
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Password reset request failed',
      };
    }
  };

  const resetPassword = async (resetData: { token: string; password: string }) => {
    try {
      const response = await updatePassword(resetData.token, resetData.password);
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Password reset failed',
      };
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
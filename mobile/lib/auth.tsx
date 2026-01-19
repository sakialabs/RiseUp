import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authAPI, setAuthToken } from './api';

interface User {
  id: number;
  email: string;
  profile: {
    id: number;
    name: string;
    profile_type: string;
    bio?: string;
    location?: string;
    causes: string[];
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, profileType: string, causes: string[]) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        setAuthToken(token);
        // In a real app, you'd validate the token and fetch user data
        // For now, we'll just set the token
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error loading token:', error);
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      const { access_token, user: userData } = response.data;
      
      await SecureStore.setItemAsync(TOKEN_KEY, access_token);
      setAuthToken(access_token);
      setUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Login failed');
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    profileType: string,
    causes: string[]
  ) => {
    try {
      const response = await authAPI.register({
        email,
        password,
        name,
        profile_type: profileType,
        causes,
      });
      const { access_token, user: userData } = response.data;
      
      await SecureStore.setItemAsync(TOKEN_KEY, access_token);
      setAuthToken(access_token);
      setUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      setAuthToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

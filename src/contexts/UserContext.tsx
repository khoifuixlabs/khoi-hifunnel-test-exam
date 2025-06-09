'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  role: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchUserProfile = async (token: string): Promise<User | null> => {
    try {
      const response = await fetch('/api/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        return result.user;
      } else {
        console.error('Failed to fetch user profile:', response.status);
        return null;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const login = async (token: string) => {
    try {
      localStorage.setItem('accessToken', token);
      const userData = await fetchUserProfile(token);

      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        // If profile fetch fails, remove the token
        localStorage.removeItem('accessToken');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      localStorage.removeItem('accessToken');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  const refreshUser = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const userData = await fetchUserProfile(token);
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    }
  };

  // Check for existing token on app load
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');

      if (token) {
        const userData = await fetchUserProfile(token);
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Token is invalid, remove it
          localStorage.removeItem('accessToken');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const value: UserContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

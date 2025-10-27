import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthContextType } from '../types/Auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to restore user from localStorage token on refresh
    const token = localStorage.getItem('authToken');
    if (token) {
      // Use the same axios instance as the rest of the app (handles cookies, baseURL)
      import('../services/api').then(({ authService }) => {
        authService.getCurrentUser()
          .then((user) => {
            if (user && user.id) {
              setUser(user);
            } else {
              setUser(null);
              localStorage.removeItem('authToken');
            }
            setIsLoading(false);
          })
          .catch(() => {
            setUser(null);
            localStorage.removeItem('authToken');
            setIsLoading(false);
          });
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('authToken', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
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
    // Do not auto-authenticate from a stored token on initial load.
    // This ensures the first screen a fresh browser session sees is the login page
    // and avoids accidental auto-sign-in UX (One-Tap, stale tokens, etc.).
    // The app still supports programmatic login via `login(user, token)`.
    setIsLoading(false);
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
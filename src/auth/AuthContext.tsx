import React, { createContext, useEffect, useState } from 'react';
import { User } from 'oidc-client-ts';
import { AuthService } from './AuthService';

export interface AuthContextProps {
  user: User | null;
  authenticated: boolean | null;
  isLoading: boolean;
  permissions: Record<string, string[]>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const initAuth = async () => {
      const isLogged = localStorage.getItem('static_logged_in');
      if (isLogged === 'true') {
        const mockUser = await AuthService.getUser();
        setUser(mockUser);
        setPermissions({
          Student: ['read', 'write', 'delete'],
          Admin: ['read', 'write', 'delete'],
          HRMS: ['read', 'write', 'delete'],
        });
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async () => {
    localStorage.setItem('static_logged_in', 'true');
    const mockUser = await AuthService.getUser();
    setUser(mockUser);
    setPermissions({
      Student: ['read', 'write', 'delete'],
      Admin: ['read', 'write', 'delete'],
      HRMS: ['read', 'write', 'delete'],
    });
    setAuthenticated(true);
  };

  const logout = async () => {
    localStorage.removeItem('static_logged_in');
    setAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, authenticated, isLoading, permissions, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

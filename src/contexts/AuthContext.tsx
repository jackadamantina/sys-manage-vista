
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, username: string, fullName: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is saved in localStorage
    const savedUser = localStorage.getItem('idm_user');
    const savedToken = localStorage.getItem('idm_token');
    
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error recovering saved user:', error);
        localStorage.removeItem('idm_user');
        localStorage.removeItem('idm_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login with:', email);
      
      const response = await apiClient.login(email, password);

      if (response.token && response.user) {
        const userInfo: User = response.user;
        
        setUser(userInfo);
        localStorage.setItem('idm_user', JSON.stringify(userInfo));
        localStorage.setItem('idm_token', response.token);
        toast.success(`Bem-vindo, ${userInfo.full_name}!`);
        return true;
      } else {
        toast.error('Resposta inválida do servidor');
        return false;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Erro ao fazer login');
      return false;
    }
  };

  const register = async (email: string, password: string, username: string, fullName: string): Promise<boolean> => {
    try {
      console.log('Attempting registration:', email, username);
      
      await apiClient.register(email, password, username, fullName);
      toast.success('Conta criada com sucesso! Faça login para continuar.');
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Erro ao criar conta');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('idm_user');
    localStorage.removeItem('idm_token');
    toast.success('Logout realizado com sucesso');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

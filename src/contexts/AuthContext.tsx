
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem('idm_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Erro ao recuperar usuário salvo:', error);
        localStorage.removeItem('idm_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Tentando fazer login com:', email);
      
      const { data, error } = await supabase
        .rpc('authenticate_idm_user', {
          p_email: email,
          p_password: password
        });

      if (error) {
        console.error('Erro na autenticação:', error);
        toast.error('Erro ao fazer login');
        return false;
      }

      console.log('Resposta da autenticação:', data);

      if (data && data.length > 0 && data[0].success) {
        const userData = data[0];
        const userInfo: User = {
          id: userData.user_id,
          email: userData.email,
          username: userData.username,
          full_name: userData.full_name,
          role: userData.role
        };
        
        setUser(userInfo);
        localStorage.setItem('idm_user', JSON.stringify(userInfo));
        toast.success(`Bem-vindo, ${userInfo.full_name}!`);
        return true;
      } else {
        toast.error('Email ou senha incorretos');
        return false;
      }
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error('Erro interno do sistema');
      return false;
    }
  };

  const register = async (email: string, password: string, username: string, fullName: string): Promise<boolean> => {
    try {
      console.log('Tentando registrar usuário:', email, username);
      
      const { error } = await supabase
        .from('user_idm')
        .insert([{
          email,
          password,
          username,
          full_name: fullName,
          role: 'user'
        }]);

      if (error) {
        console.error('Erro no cadastro:', error);
        if (error.code === '23505') {
          toast.error('Email ou nome de usuário já existem');
        } else {
          toast.error('Erro ao criar conta');
        }
        return false;
      }

      toast.success('Conta criada com sucesso! Faça login para continuar.');
      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      toast.error('Erro interno do sistema');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('idm_user');
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

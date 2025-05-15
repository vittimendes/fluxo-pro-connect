
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, mockAuthService } from '../services/mockData';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await mockAuthService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Authentication error:', error);
        toast({
          title: "Erro de autenticação",
          description: "Não foi possível verificar sua sessão.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [toast]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const loggedInUser = await mockAuthService.login(email, password);
      if (loggedInUser) {
        mockAuthService.saveUser(loggedInUser);
        setUser(loggedInUser);
        toast({
          title: "Login realizado",
          description: `Bem-vindo(a), ${loggedInUser.name}!`,
        });
        return true;
      } else {
        toast({
          title: "Falha no login",
          description: "E-mail ou senha incorretos.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro ao tentar fazer login.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await mockAuthService.logout();
      setUser(null);
      toast({
        title: "Logout realizado",
        description: "Você saiu com sucesso.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Erro no logout",
        description: "Ocorreu um erro ao tentar sair.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<User> => {
    setLoading(true);
    try {
      const updatedUser = await mockAuthService.updateProfile(userData);
      setUser(updatedUser);
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
      return updatedUser;
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Erro na atualização",
        description: "Não foi possível atualizar seu perfil.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

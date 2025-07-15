
'use client';
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { mockLogin, mockLogout, checkMockSession, User, updateUser as updateAuthUser } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: User) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session on initial load
    const sessionUser = checkMockSession();
    if (sessionUser) {
      setUser(sessionUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    const result = await mockLogin(email, pass);
    if (result.success && result.user) {
      setUser(result.user);
    }
    setLoading(false);
    return { success: result.success, error: result.error };
  };

  const logout = async () => {
    setLoading(true);
    await mockLogout();
    setUser(null);
    setLoading(false);
  };
  
  const updateUser = useCallback(async (updatedUser: User) => {
    setLoading(true);
    const result = await updateAuthUser(updatedUser);
    if (result.success && result.user) {
        // If the updated user is the currently logged-in user, update the context state
        if (user && user.id === result.user.id) {
            setUser(result.user);
        }
    }
    setLoading(false);
    return result;
  }, [user]);

  const value = { user, loading, login, logout, updateUser };

  return (
    <AuthContext.Provider value={value}>
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

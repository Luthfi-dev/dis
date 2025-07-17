
'use client';
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { User } from '@/lib/auth';
import { loginAction, updateUserAction } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: Partial<User> & { id: string }) => Promise<{ success: boolean; user?: User; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'eduarchive_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session on initial load from localStorage
    try {
        const sessionData = localStorage.getItem(SESSION_KEY);
        if (sessionData) {
            setUser(JSON.parse(sessionData));
        }
    } catch (error) {
        console.error("Failed to read session from localStorage", error);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    const result = await loginAction(email, pass);
    if (result.success && result.user) {
      setUser(result.user);
      localStorage.setItem(SESSION_KEY, JSON.stringify(result.user));
    }
    setLoading(false);
    return { success: result.success, error: result.error };
  };

  const logout = async () => {
    setLoading(true);
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    setLoading(false); // This line was missing the logic
  };
  
  const updateUser = useCallback(async (updatedUserData: Partial<User> & { id: string }) => {
    setLoading(true);
    const result = await updateUserAction(updatedUserData);
    if (result.success && result.user) {
        // If the updated user is the currently logged-in user, update the context and session
        if (user && user.id === result.user.id) {
            setUser(result.user);
            localStorage.setItem(SESSION_KEY, JSON.stringify(result.user));
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

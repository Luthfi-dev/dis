
'use client';
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { User } from '@/lib/auth';
import pool from '@/lib/db'; // This won't work on client, must be used in server actions
import { logActivity } from '@/lib/activity-log';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: Partial<User> & { id: string }) => Promise<{ success: boolean; user?: User; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define server actions within the client file for simplicity or move to a separate actions file
async function loginAction(email: string, pass: string): Promise<{ success: boolean; user?: User; error?: string }> {
    'use server';
    try {
        const [rows]: any[] = await pool.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);
        const user = rows[0];

        if (!user) {
            return { success: false, error: 'Email atau password salah.' };
        }

        if (user.status === 'blocked') {
            return { success: false, error: 'Akun Anda telah diblokir.' };
        }
        
        // This is NOT secure hashing. Replace with bcrypt in a real app.
        const providedHashedPassword = `hashed_${pass}`;
        if (user.password !== providedHashedPassword) {
            return { success: false, error: 'Email atau password salah.' };
        }
        
        const sessionUser = { ...user };
        delete sessionUser.password;
        return { success: true, user: sessionUser };

    } catch (error: any) {
        console.error('Login Error:', error);
        return { success: false, error: 'Terjadi kesalahan pada server.' };
    }
}

async function updateUserAction(updatedUserData: Partial<User> & { id: string }): Promise<{ success: boolean, user?: User, error?: string }> {
    'use server';
    try {
        const { id, ...dataToUpdate } = updatedUserData;

        if (dataToUpdate.password) {
            // This is NOT secure hashing. Replace with bcrypt in a real app.
            dataToUpdate.password = `hashed_${dataToUpdate.password}`;
        }

        const fields = Object.keys(dataToUpdate).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(dataToUpdate), id];

        await pool.query(`UPDATE users SET ${fields} WHERE id = ?`, values);
        
        const [rows]: any[] = await pool.query('SELECT id, email, name, role, status, avatar FROM users WHERE id = ?', [id]);
        const updatedUser = rows[0];
        
        logActivity(`Memperbarui profil pengguna ${updatedUser.name}`);
        return { success: true, user: updatedUser };

    } catch (error: any) {
        console.error('Update User Error:', error);
        return { success: false, error: 'Gagal memperbarui pengguna.' };
    }
}

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
    setLoading(false);
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

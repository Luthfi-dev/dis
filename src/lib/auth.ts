
'use client';

// This is a mock authentication service that mimics JWT-style authentication.
// It uses localStorage to persist the "session" and includes mock user data.

export type User = {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'admin' | 'user';
  status: 'active' | 'blocked';
  avatar?: string;
  // This is not stored but used for mock login/update
  password?: string;
};

const USERS_KEY = 'eduarchive_users';
const SESSION_KEY = 'eduarchive_session';

// --- Mock User Database ---
const defaultUsers: User[] = [
  {
    id: '1',
    email: 'superadmin@gmail.com',
    name: 'Super Admin',
    role: 'superadmin',
    status: 'active',
    password: 'superadmin*#',
  },
  {
    id: '2',
    email: 'admin@eduarchive.com',
    name: 'Administrator',
    role: 'admin',
    status: 'active',
    password: 'password123',
  },
  {
    id: '3',
    email: 'blocked@eduarchive.com',
    name: 'Blocked User',
    role: 'admin',
    status: 'blocked',
    password: 'password123',
  },
];

const getFromStorage = <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') {
        return defaultValue;
    }
    try {
        const item = window.localStorage.getItem(key);
        if (item === null) {
            window.localStorage.setItem(key, JSON.stringify(defaultValue));
            return defaultValue;
        }
        return JSON.parse(item);
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return defaultValue;
    }
};

export const getUsers = (): User[] => getFromStorage<User[]>(USERS_KEY, defaultUsers);
export const saveUsers = (users: User[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
};

// Initialize users if not present
if (typeof window !== 'undefined' && !localStorage.getItem(USERS_KEY)) {
    saveUsers(defaultUsers);
}


/**
 * Simulates a login request.
 */
export async function mockLogin(email: string, pass: string): Promise<{ success: boolean; user?: User; error?: string }> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return { success: false, error: 'Email atau password salah.' };
  }

  if (user.status === 'blocked') {
    return { success: false, error: 'Akun Anda telah diblokir.' };
  }

  // In a real app, you'd compare a hashed password. Here, we check the mock plain text password.
  if (user.password !== pass) {
    return { success: false, error: 'Email atau password salah.' };
  }

  try {
    const sessionUser = { ...user };
    delete sessionUser.password; // Don't store password in session
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return { success: true, user: sessionUser };
  } catch (error) {
    return { success: false, error: 'Gagal membuat sesi di browser.' };
  }
}

/**
 * Updates a user's information.
 */
export async function updateUser(updatedUserData: Partial<User> & { id: string }): Promise<{ success: boolean; user?: User; error?: string }> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === updatedUserData.id);

    if (userIndex === -1) {
        return { success: false, error: 'Pengguna tidak ditemukan.' };
    }

    const originalUser = users[userIndex];
    const newUser = { ...originalUser, ...updatedUserData };

    users[userIndex] = newUser;
    saveUsers(users);

    const sessionUser = { ...newUser };
    delete sessionUser.password;

    // If the updated user is the one in session, update the session too
    const currentSession = checkMockSession();
    if (currentSession && currentSession.id === newUser.id) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    }
    
    return { success: true, user: sessionUser };
}


/**
 * Simulates a logout request.
 */
export async function mockLogout(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 200));
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error("Failed to clear session from localStorage", error);
  }
}

/**
 * Checks if a valid session exists in localStorage.
 */
export function checkMockSession(): User | null {
  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (sessionData) {
      const user = JSON.parse(sessionData) as User;
      // Re-verify user exists
      const users = getUsers();
      const liveUser = users.find(u => u.id === user.id);
      return liveUser ? user : null;
    }
    return null;
  } catch (error) {
    return null;
  }
}

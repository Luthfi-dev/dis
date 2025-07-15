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
};

// --- Mock User Database ---
const mockUsers: User[] = [
  {
    id: '1',
    email: 'superadmin@gmail.com',
    name: 'Super Admin',
    role: 'superadmin',
    status: 'active',
  },
  {
    id: '2',
    email: 'admin@eduarchive.com',
    name: 'Administrator',
    role: 'admin',
    status: 'active',
  },
  {
    id: '3',
    email: 'blocked@eduarchive.com',
    name: 'Blocked User',
    role: 'admin',
    status: 'blocked',
  },
];

// Special passwords for mock users
const mockPasswords: Record<string, string> = {
  'superadmin@gmail.com': 'superadmin*#',
  'admin@eduarchive.com': 'password123',
  'blocked@eduarchive.com': 'password123',
};


const SESSION_KEY = 'eduarchive_session';

/**
 * Simulates a login request.
 * @param email The user's email.
 * @param pass The user's password.
 * @returns A promise that resolves to an object with success status, user data, or an error message.
 */
export async function mockLogin(email: string, pass: string): Promise<{ success: boolean; user?: User; error?: string }> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return { success: false, error: 'Email atau password salah.' };
  }

  if (user.status === 'blocked') {
    return { success: false, error: 'Akun Anda telah diblokir.' };
  }

  const expectedPassword = mockPasswords[user.email];
  if (pass !== expectedPassword) {
    return { success: false, error: 'Email atau password salah.' };
  }

  // Simulate creating a session/token and storing it.
  try {
    const sessionData = JSON.stringify(user);
    localStorage.setItem(SESSION_KEY, sessionData);
    return { success: true, user };
  } catch (error) {
    return { success: false, error: 'Gagal membuat sesi di browser.' };
  }
}

/**
 * Simulates a logout request.
 */
export async function mockLogout(): Promise<void> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200));
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error("Failed to clear session from localStorage", error);
  }
}

/**
 * Checks if a valid session exists in localStorage.
 * @returns The user object if a session exists, otherwise null.
 */
export function checkMockSession(): User | null {
  try {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (sessionData) {
      const user = JSON.parse(sessionData) as User;
      // You might want to add more validation here, e.g., check if the user still exists in the "database"
      return user;
    }
    return null;
  } catch (error) {
    return null;
  }
}

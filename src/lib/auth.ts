
'use server';
import 'server-only';
import pool from './db';

// This file now directly interacts with the database for all auth operations.

export type User = {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'admin' | 'user';
  status: 'active' | 'blocked';
  avatar?: string;
  password?: string; // This should only be the hashed password from the DB
};

export async function loginAction(email: string, pass: string): Promise<{ success: boolean; user?: User; error?: string }> {
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
        // For this example, we assume password stored in DB is already "hashed"
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

export async function updateUserAction(updatedUserData: Partial<User> & { id: string }): Promise<{ success: boolean, user?: User, error?: string }> {
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
        
        // Removed client-side logActivity call
        return { success: true, user: updatedUser };

    } catch (error: any) {
        console.error('Update User Error:', error);
        return { success: false, error: 'Gagal memperbarui pengguna.' };
    }
}

/**
 * Fetches all users from the database, excluding superadmin.
 * Used for the user management page.
 */
export async function getUsers(): Promise<User[]> {
    const [rows] = await pool.query("SELECT id, email, name, role, status, avatar FROM users WHERE role != 'superadmin'");
    return rows as User[];
}

/**
 * Saves or updates a user in the database.
 * Hashes password if provided.
 */
export async function saveUser(user: Partial<User> & { id?: string }): Promise<{ success: boolean; message: string }> {
    try {
        const isUpdating = !!user.id;
        
        if (user.password) {
            user.password = `hashed_${user.password}`; 
        } else {
            delete user.password;
        }

        if (isUpdating) {
            const { id, ...updateData } = user;
            const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
            const values = Object.values(updateData);
            await pool.query(`UPDATE users SET ${fields} WHERE id = ?`, [...values, id]);
            return { success: true, message: 'Pengguna berhasil diperbarui.' };
        } else {
            user.id = user.id || crypto.randomUUID();
            const fields = Object.keys(user);
            const placeholders = fields.map(() => '?').join(', ');
            const values = Object.values(user);
            await pool.query(`INSERT INTO users (${fields.join(', ')}) VALUES (${placeholders})`, values);
            return { success: true, message: 'Pengguna berhasil ditambahkan.' };
        }
    } catch (error: any) {
        console.error("Error saving user:", error);
        return { success: false, message: error.message };
    }
}


/**
 * Deletes a user from the database.
 */
export async function deleteUser(id: string): Promise<{ success: boolean; message: string }> {
    try {
        const [result]: any = await pool.query('DELETE FROM users WHERE id = ?', [id]);
        if (result.affectedRows > 0) {
            return { success: true, message: 'Pengguna berhasil dihapus.' };
        }
        return { success: false, message: 'Pengguna tidak ditemukan.' };
    } catch (error: any) {
        console.error("Error deleting user:", error);
        return { success: false, message: error.message };
    }
}


'use server';
import 'server-only';
import pool from './db';
import { logActivity } from './activity-log';

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
        
        // In a real app, use a strong hashing library like bcrypt or argon2
        // For simplicity, we'll simulate hashing. A real implementation is required for production.
        if (user.password) {
            // This is NOT secure hashing. Replace with bcrypt in a real app.
            user.password = `hashed_${user.password}`; 
        } else {
            delete user.password; // Don't save empty password
        }

        if (isUpdating) {
            const { id, ...updateData } = user;
            const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
            const values = Object.values(updateData);
            await pool.query(`UPDATE users SET ${fields} WHERE id = ?`, [...values, id]);
            logActivity(`Memperbarui pengguna ${user.name || ''}`);
            return { success: true, message: 'Pengguna berhasil diperbarui.' };
        } else {
            user.id = user.id || crypto.randomUUID();
            const fields = Object.keys(user);
            const placeholders = fields.map(() => '?').join(', ');
            const values = Object.values(user);
            await pool.query(`INSERT INTO users (${fields.join(', ')}) VALUES (${placeholders})`, values);
            logActivity(`Menambahkan pengguna baru: ${user.name}`);
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
            logActivity(`Menghapus pengguna dengan ID: ${id}`);
            return { success: true, message: 'Pengguna berhasil dihapus.' };
        }
        return { success: false, message: 'Pengguna tidak ditemukan.' };
    } catch (error: any) {
        console.error("Error deleting user:", error);
        return { success: false, message: error.message };
    }
}

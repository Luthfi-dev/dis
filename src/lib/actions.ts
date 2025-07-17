
'use server';

import type { Siswa } from './data';
import type { Pegawai } from './pegawai-data';
import { sanitizeData } from './utils';
import type { PegawaiFormData } from '@/lib/pegawai-data';
import type { StudentFormData } from '@/lib/student-data-t';
import pool from './db';

// --- Public-facing Server Actions ---

// SISWA ACTIONS
export async function getSiswa(): Promise<Siswa[]> {
    const [rows] = await pool.query('SELECT * FROM siswa');
    return (rows as Siswa[]).map(row => ({
        ...row,
        documents: typeof row.documents === 'string' ? JSON.parse(row.documents) : row.documents,
        siswa_fotoProfil: typeof row.siswa_fotoProfil === 'string' ? JSON.parse(row.siswa_fotoProfil) : row.siswa_fotoProfil,
    }));
}

export async function getSiswaById(id: string): Promise<Siswa | null> {
    const [rows] = await pool.query('SELECT * FROM siswa WHERE id = ?', [id]);
    const siswa = (rows as Siswa[])[0] || null;
    if (siswa) {
        siswa.documents = typeof siswa.documents === 'string' ? JSON.parse(siswa.documents) : siswa.documents;
        siswa.siswa_fotoProfil = typeof siswa.siswa_fotoProfil === 'string' ? JSON.parse(siswa.siswa_fotoProfil) : siswa.siswa_fotoProfil;
    }
    return siswa;
}

export async function deleteSiswa(id: string): Promise<{ success: boolean; message: string }> {
    const [result]:any = await pool.query('DELETE FROM siswa WHERE id = ?', [id]);
    if (result.affectedRows > 0) {
        return { success: true, message: `Data siswa berhasil dihapus.` };
    }
    return { success: false, message: 'Gagal menghapus data siswa.' };
}

export async function submitStudentData(data: StudentFormData, studentId?: string) {
    try {
        const sanitizedData = sanitizeData(data);
        
        const isComplete = sanitizedData.siswa_namaLengkap && sanitizedData.siswa_nis && sanitizedData.siswa_nisn;
        const status = isComplete ? 'Lengkap' : 'Belum Lengkap';

        const dataForDb: Record<string, any> = {
            ...sanitizedData,
            status,
        };
        
        // Ensure all object/array fields are stringified and empty strings are converted to null
        for (const key in dataForDb) {
            if (typeof dataForDb[key] === 'object' && dataForDb[key] !== null) {
                dataForDb[key] = JSON.stringify(dataForDb[key]);
            }
             if (dataForDb[key] === '') {
                dataForDb[key] = null;
            }
        }

        if (studentId) {
            // --- UPDATE LOGIC ---
            const { id, ...updateData } = dataForDb; // Exclude id from update payload
            const fields = Object.keys(updateData).map(f => `${f} = ?`).join(', ');
            const values = Object.values(updateData);

            const sql = `UPDATE siswa SET ${fields} WHERE id = ?`;
            const queryValues = [...values, studentId];
            
            await pool.query(sql, queryValues);
            const message = `Data siswa ${sanitizedData.siswa_namaLengkap} berhasil diperbarui!`;
            return { success: true, message };

        } else {
            // --- CREATE LOGIC ---
            const id = crypto.randomUUID();
            const finalData = { ...dataForDb, id };
            
            const fields = Object.keys(finalData);
            const values = Object.values(finalData);

            const sql = `INSERT INTO siswa (${fields.join(', ')}) VALUES (${values.map(() => '?').join(', ')})`;
            
            await pool.query(sql, values);
            const message = `Data siswa ${finalData.siswa_namaLengkap} berhasil disimpan!`;
            return { success: true, message };
        }
    } catch (error: any) {
        console.error("Student submission server error:", error);
        return { success: false, message: `Gagal menyimpan data siswa karena kesalahan server: ${error.message}` };
    }
}


// PEGAWAI ACTIONS
export async function getPegawai(): Promise<Pegawai[]> {
    const [rows] = await pool.query('SELECT * FROM pegawai');
     return (rows as Pegawai[]).map(row => {
        const parsedRow: any = { ...row };
        for (const key in parsedRow) {
            if (key.startsWith('pegawai_') && typeof parsedRow[key] === 'string') {
                try {
                    parsedRow[key] = JSON.parse(parsedRow[key]);
                } catch (e) {
                    // Not a JSON string, leave it as is
                }
            }
        }
        return parsedRow;
    });
}

export async function getPegawaiById(id: string): Promise<Pegawai | null> {
    const [rows] = await pool.query('SELECT * FROM pegawai WHERE id = ?', [id]);
    const p = (rows as Pegawai[])[0] || null;
    if (p) {
        const parsedP: any = { ...p };
         for (const key in parsedP) {
            if (key.startsWith('pegawai_') && typeof parsedP[key] === 'string') {
                try {
                    parsedP[key] = JSON.parse(parsedP[key]);
                } catch (e) {
                     // Not a JSON string, leave it as is
                }
            }
        }
        return parsedP;
    }
    return null;
}

export async function deletePegawai(id: string): Promise<{ success: boolean; message: string }> {
    const [result]:any = await pool.query('DELETE FROM pegawai WHERE id = ?', [id]);
    if (result.affectedRows > 0) {
        return { success: true, message: `Data pegawai berhasil dihapus.` };
    }
    return { success: false, message: 'Gagal menghapus data pegawai.' };
}

export async function submitPegawaiData(data: PegawaiFormData, pegawaiId?: string) {
    try {
        const sanitizedData = sanitizeData(data);
        
        const status = sanitizedData.pegawai_nama && sanitizedData.pegawai_nip ? 'Lengkap' : 'Belum Lengkap';
        
        const dataForDb: Record<string, any> = {
            ...sanitizedData,
            status,
        };

        // Explicitly stringify all object/array fields and handle empty strings
        for (const key in dataForDb) {
            if (typeof dataForDb[key] === 'object' && dataForDb[key] !== null) {
                dataForDb[key] = JSON.stringify(dataForDb[key]);
            }
            if (dataForDb[key] === '') {
                dataForDb[key] = null;
            }
        }

        if (pegawaiId) {
            const { id, ...updateData } = dataForDb;
            const fields = Object.keys(updateData).map(f => `${f} = ?`).join(', ');
            const values = Object.values(updateData);
            const sql = `UPDATE pegawai SET ${fields} WHERE id = ?`;
            const queryValues = [...values, pegawaiId];
            await pool.query(sql, queryValues);
        } else {
            const id = crypto.randomUUID();
            const finalData = { ...dataForDb, id };
            const fields = Object.keys(finalData);
            const values = Object.values(finalData);
            const sql = `INSERT INTO pegawai (${fields.join(', ')}) VALUES (${values.map(() => '?').join(', ')})`;
            await pool.query(sql, values);
        }

        const message = pegawaiId ? `Data pegawai ${sanitizedData.pegawai_nama} berhasil diperbarui!` : `Data pegawai ${sanitizedData.pegawai_nama} berhasil disimpan!`;

        return { success: true, message };
    } catch (error: any) {
        console.error("Pegawai submission server error:", error);
        return { success: false, message: `Gagal menyimpan data pegawai karena kesalahan server: ${error.message}` };
    }
}

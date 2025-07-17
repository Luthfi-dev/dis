
'use server';

import type { Siswa } from './data';
import type { Pegawai } from './pegawai-data';
import { sanitizeAndFormatData } from './utils';
import type { PegawaiFormData } from '@/lib/pegawai-data';
import type { StudentFormData } from '@/lib/student-data-t';
import pool from './db';

// --- Public-facing Server Actions ---

// SISWA ACTIONS
export async function getSiswa(): Promise<Siswa[]> {
    const [rows] = await pool.query('SELECT * FROM siswa');
    return (rows as Siswa[]).map(row => {
        const parsedRow: any = { ...row };
        for (const key in parsedRow) {
            if (typeof parsedRow[key] === 'string') {
                try {
                    if (parsedRow[key].startsWith('{') || parsedRow[key].startsWith('[')) {
                        parsedRow[key] = JSON.parse(parsedRow[key]);
                    }
                } catch (e) {
                    // Not a JSON string, leave it as is
                }
            }
        }
        return parsedRow;
    });
}

export async function getSiswaById(id: string): Promise<Siswa | null> {
    const [rows] = await pool.query('SELECT * FROM siswa WHERE id = ?', [id]);
    const siswa = (rows as Siswa[])[0] || null;
    if (siswa) {
        const parsedSiswa: any = { ...siswa };
         for (const key in parsedSiswa) {
            if (typeof parsedSiswa[key] === 'string') {
                try {
                     if (parsedSiswa[key].startsWith('{') || parsedSiswa[key].startsWith('[')) {
                        parsedSiswa[key] = JSON.parse(parsedSiswa[key]);
                    }
                } catch (e) {
                     // Not a JSON string, leave it as is
                }
            }
        }
        return parsedSiswa;
    }
    return null;
}

export async function deleteSiswa(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const [result]:any = await pool.query('DELETE FROM siswa WHERE id = ?', [id]);
      if (result.affectedRows > 0) {
          return { success: true, message: `Data siswa berhasil dihapus.` };
      }
      return { success: false, message: 'Gagal menghapus data siswa.' };
    } catch (error: any) {
        return { success: false, message: `Gagal menghapus data siswa: ${error.message}` };
    }
}

export async function submitStudentData(data: StudentFormData, studentId?: string) {
    try {
        const dataForDb = sanitizeAndFormatData(data);
        
        const isComplete = dataForDb.siswa_namaLengkap && dataForDb.siswa_nis && dataForDb.siswa_nisn;
        
        if (studentId) {
            // --- UPDATE LOGIC ---
            dataForDb.status = isComplete ? 'Lengkap' : 'Belum Lengkap';
            const { id, ...updateData } = dataForDb; // Exclude id from update payload
            const fields = Object.keys(updateData).map(f => `${f} = ?`).join(', ');
            const values = Object.values(updateData);

            const sql = `UPDATE siswa SET ${fields} WHERE id = ?`;
            const queryValues = [...values, studentId];
            
            await pool.query(sql, queryValues);
            const message = `Data siswa ${dataForDb.siswa_namaLengkap} berhasil diperbarui!`;
            return { success: true, message };

        } else {
            // --- CREATE LOGIC ---
            dataForDb.id = crypto.randomUUID();
            dataForDb.status = isComplete ? 'Lengkap' : 'Belum Lengkap';
            
            const fields = Object.keys(dataForDb);
            const values = Object.values(dataForDb);

            const sql = `INSERT INTO siswa (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`;
            
            await pool.query(sql, values);
            const message = `Data siswa ${dataForDb.siswa_namaLengkap} berhasil disimpan!`;
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
            if (typeof parsedRow[key] === 'string') {
                try {
                    // Only parse if it looks like a JSON object or array
                    if (parsedRow[key].startsWith('{') || parsedRow[key].startsWith('[')) {
                        parsedRow[key] = JSON.parse(parsedRow[key]);
                    }
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
            if (typeof parsedP[key] === 'string') {
                try {
                     if (parsedP[key].startsWith('{') || parsedP[key].startsWith('[')) {
                        parsedP[key] = JSON.parse(parsedP[key]);
                    }
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
     try {
        const [result]:any = await pool.query('DELETE FROM pegawai WHERE id = ?', [id]);
        if (result.affectedRows > 0) {
            return { success: true, message: `Data pegawai berhasil dihapus.` };
        }
        return { success: false, message: 'Gagal menghapus data pegawai.' };
    } catch (error: any) {
        return { success: false, message: `Gagal menghapus data pegawai: ${error.message}` };
    }
}

export async function submitPegawaiData(data: PegawaiFormData, pegawaiId?: string) {
    try {
        const dataForDb = sanitizeAndFormatData(data);
        
        const isComplete = dataForDb.pegawai_nama && dataForDb.pegawai_nip;
        
        if (pegawaiId) {
            dataForDb.status = isComplete ? 'Lengkap' : 'Belum Lengkap';
            const { id, ...updateData } = dataForDb;
            const fields = Object.keys(updateData).map(f => `${f} = ?`).join(', ');
            const values = Object.values(updateData);
            const sql = `UPDATE pegawai SET ${fields} WHERE id = ?`;
            const queryValues = [...values, pegawaiId];
            await pool.query(sql, queryValues);
        } else {
            dataForDb.id = crypto.randomUUID();
            dataForDb.status = isComplete ? 'Lengkap' : 'Belum Lengkap';
            const fields = Object.keys(dataForDb);
            const values = Object.values(dataForDb);
            const sql = `INSERT INTO pegawai (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`;
            await pool.query(sql, values);
        }

        const message = pegawaiId ? `Data pegawai ${dataForDb.pegawai_nama} berhasil diperbarui!` : `Data pegawai ${dataForDb.pegawai_nama} berhasil disimpan!`;

        return { success: true, message };
    } catch (error: any) {
        console.error("Pegawai submission server error:", error);
        return { success: false, message: `Gagal menyimpan data pegawai karena kesalahan server: ${error.message}` };
    }
}

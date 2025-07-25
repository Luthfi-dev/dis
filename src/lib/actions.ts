
'use server';

import type { Siswa } from './data';
import type { Pegawai } from './pegawai-data';
import { sanitizeAndFormatData } from './utils';
import type { PegawaiFormData } from '@/lib/pegawai-data';
import type { StudentFormData } from '@/lib/student-data-t';
import pool from './db';
import { isEqual, omit } from 'lodash';
import Excel from 'exceljs';

// Helper function to parse JSON fields safely
function parseJsonFields(row: any) {
    if (!row) return null;
    const parsedRow = { ...row };
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
}


// --- Public-facing Server Actions ---

// SISWA ACTIONS
export async function getSiswa(): Promise<Siswa[]> {
    const db = await pool.getConnection();
    try {
        const [rows] = await db.query('SELECT * FROM siswa ORDER BY siswa_namaLengkap ASC');
        return (rows as Siswa[]).map(parseJsonFields);
    } finally {
        db.release();
    }
}

export async function getSiswaById(id: string): Promise<Siswa | null> {
    const db = await pool.getConnection();
    try {
        const [rows] = await db.query('SELECT * FROM siswa WHERE id = ?', [id]);
        return parseJsonFields((rows as Siswa[])[0] || null);
    } finally {
        db.release();
    }
}

export async function deleteSiswa(id: string): Promise<{ success: boolean; message: string }> {
    const db = await pool.getConnection();
    try {
      const [result]:any = await db.query('DELETE FROM siswa WHERE id = ?', [id]);
      if (result.affectedRows > 0) {
          const message = `Data siswa berhasil dihapus.`;
          return { success: true, message };
      }
      return { success: false, message: 'Gagal menghapus data siswa.' };
    } catch (error: any) {
        return { success: false, message: `Gagal menghapus data siswa: ${error.message}` };
    } finally {
        db.release();
    }
}

export async function submitStudentData(data: StudentFormData, studentId?: string) {
    const db = await pool.getConnection();
    try {
        // --- DUPLICATE CHECK ---
        if (data.siswa_nis || data.siswa_nisn) {
             const conditions = [];
             const params = [];
             if(data.siswa_nis) {
                conditions.push('siswa_nis = ?');
                params.push(data.siswa_nis);
             }
             if(data.siswa_nisn) {
                conditions.push('siswa_nisn = ?');
                params.push(data.siswa_nisn);
             }

            if (conditions.length > 0) {
                const [existing]: any = await db.query(
                    `SELECT id FROM siswa WHERE (${conditions.join(' OR ')}) AND id != ?`,
                    [...params, studentId || '']
                );
                if (existing.length > 0) {
                    return { success: false, message: 'NIS atau NISN sudah terdaftar untuk siswa lain.' };
                }
            }
        }
        
        await db.beginTransaction();
        const dataForDb = sanitizeAndFormatData(data);
        
        const isComplete = dataForDb.siswa_namaLengkap && dataForDb.siswa_nis && dataForDb.siswa_nisn;
        dataForDb.status = isComplete ? 'Lengkap' : 'Belum Lengkap';

        const insertData = omit(dataForDb, ['id', 'created_at', 'updated_at']);

        if (studentId) {
            // --- UPDATE LOGIC ---
            const fields = Object.keys(insertData).map(f => `${f} = ?`).join(', ');
            const values = Object.values(insertData);

            if (fields.length > 0) {
                 const sql = `UPDATE siswa SET ${fields} WHERE id = ?`;
                 await db.query(sql, [...values, studentId]);
            }
        } else {
            // --- CREATE LOGIC ---
             const fields = Object.keys(insertData);
             const values = Object.values(insertData);
             const placeholders = fields.map(() => '?').join(', ');
            
             if (fields.length > 0) {
                const sql = `INSERT INTO siswa (${fields.join(', ')}) VALUES (${placeholders})`;
                await db.query(sql, values);
             }
        }
        
        await db.commit();
        const message = `Data siswa ${data.siswa_namaLengkap} berhasil ${studentId ? 'diperbarui' : 'disimpan'}!`;
        return { success: true, message };

    } catch (error: any) {
        await db.rollback();
        console.error("Student submission server error:", error);
        return { success: false, message: `Gagal menyimpan data siswa karena kesalahan server: ${error.message}` };
    } finally {
        db.release();
    }
}


// PEGAWAI ACTIONS
export async function getPegawai(): Promise<Pegawai[]> {
    const db = await pool.getConnection();
    try {
        const [rows] = await db.query('SELECT * FROM pegawai ORDER BY pegawai_nama ASC');
         return (rows as Pegawai[]).map(parseJsonFields);
    } finally {
        db.release();
    }
}

export async function getPegawaiById(id: string): Promise<Pegawai | null> {
    const db = await pool.getConnection();
    try {
        const [rows] = await db.query('SELECT * FROM pegawai WHERE id = ?', [id]);
        return parseJsonFields((rows as Pegawai[])[0] || null);
    } finally {
        db.release();
    }
}

export async function deletePegawai(id: string): Promise<{ success: boolean; message: string }> {
     const db = await pool.getConnection();
     try {
        const [result]:any = await db.query('DELETE FROM pegawai WHERE id = ?', [id]);
        if (result.affectedRows > 0) {
            const message = `Data pegawai berhasil dihapus.`;
            return { success: true, message };
        }
        return { success: false, message: 'Gagal menghapus data pegawai.' };
    } catch (error: any) {
        return { success: false, message: `Gagal menghapus data pegawai: ${error.message}` };
    } finally {
        db.release();
    }
}

export async function submitPegawaiData(data: PegawaiFormData, pegawaiId?: string) {
    const db = await pool.getConnection();
    try {
        // --- DUPLICATE CHECK ---
        if (data.pegawai_nip) {
            const [existing]: any = await db.query(
                'SELECT id FROM pegawai WHERE pegawai_nip = ? AND id != ?',
                [data.pegawai_nip, pegawaiId || '']
            );
            if (existing.length > 0) {
                return { success: false, message: 'NIP sudah terdaftar untuk pegawai lain.' };
            }
        }

        await db.beginTransaction();
        const dataForDb = sanitizeAndFormatData(data);
        
        const isComplete = dataForDb.pegawai_nama && dataForDb.pegawai_nip;
        dataForDb.status = isComplete ? 'Lengkap' : 'Belum Lengkap';
        
        const insertData = omit(dataForDb, ['id', 'created_at', 'updated_at']);

        if (pegawaiId) {
            // --- UPDATE LOGIC ---
             const fields = Object.keys(insertData).map(f => `${f} = ?`).join(', ');
             const values = Object.values(insertData);
             if (fields.length > 0) {
                 const sql = `UPDATE pegawai SET ${fields} WHERE id = ?`;
                 await db.query(sql, [...values, pegawaiId]);
             }
        } else {
             // --- CREATE LOGIC ---
             const fields = Object.keys(insertData);
             const values = Object.values(insertData);
             const placeholders = fields.map(() => '?').join(', ');
            
             if (fields.length > 0) {
                const sql = `INSERT INTO pegawai (${fields.join(', ')}) VALUES (${placeholders})`;
                await db.query(sql, values);
             }
        }
        
        await db.commit();
        const message = `Data pegawai ${data.pegawai_nama} berhasil ${pegawaiId ? 'diperbarui' : 'disimpan'}!`;
        return { success: true, message };

    } catch (error: any) {
        await db.rollback();
        console.error("Pegawai submission server error:", error);
        return { success: false, message: `Gagal menyimpan data pegawai karena kesalahan server: ${error.message}` };
    } finally {
        db.release();
    }
}


// --- APP SETTINGS ACTIONS ---

export type AppSettings = {
  app_title?: string;
  app_description?: string;
  app_logo_url?: string;
};

export async function getAppSettings(): Promise<AppSettings> {
    const db = await pool.getConnection();
    try {
        const [rows] = await db.query('SELECT app_title, app_description, app_logo_url FROM app_settings WHERE id = 1');
        const settings = (rows as AppSettings[])[0];
        return settings || { app_title: 'EduArchive', app_description: 'Aplikasi Buku Induk Siswa Digital' };
    } catch(e) {
        console.error("Could not get app settings, returning default.", e);
        return { app_title: 'EduArchive', app_description: 'Aplikasi Buku Induk Siswa Digital' };
    } finally {
        db.release();
    }
}

export async function saveAppSettings(data: AppSettings): Promise<{ success: boolean; message: string }> {
    const db = await pool.getConnection();
    try {
        const { app_title, app_description, app_logo_url } = data;
        await db.query(
            'UPDATE app_settings SET app_title = ?, app_description = ?, app_logo_url = ? WHERE id = 1',
            [app_title, app_description, app_logo_url]
        );
        return { success: true, message: 'Pengaturan aplikasi berhasil disimpan.' };
    } catch (error: any) {
        console.error("Error saving app settings:", error);
        return { success: false, message: `Gagal menyimpan pengaturan: ${error.message}` };
    } finally {
        db.release();
    }
}

// --- IMPORT ACTIONS ---
export type ImportResult = {
    success: boolean;
    message: string;
    totalRows: number;
    successCount: number;
    failureCount: number;
    errors: { row: number, reason: string }[];
};

export async function importData(type: 'siswa' | 'pegawai', fileBuffer: Buffer): Promise<ImportResult> {
    const db = await pool.getConnection();
    const workbook = new Excel.Workbook();
    await workbook.xlsx.load(fileBuffer);
    const worksheet = workbook.worksheets[0];

    const results: ImportResult = {
        success: true,
        message: 'Impor selesai.',
        totalRows: worksheet.rowCount - 1,
        successCount: 0,
        failureCount: 0,
        errors: [],
    };

    const headerRow = worksheet.getRow(1);
    const headers = headerRow.values as string[];

    for (let i = 2; i <= worksheet.rowCount; i++) {
        const row = worksheet.getRow(i);
        const rowData: any = {};
        
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            const headerCell = headerRow.getCell(colNumber);
            const key = headerCell.text.split(' ')[0].toLowerCase(); // Simplified key extraction
             const dbKey = `${type}_${key.replace('lengkap', 'namaLengkap').replace('nisn(wajib)', 'nisn').replace('nis(wajib)', 'nis').replace('nip(wajib)', 'nip')}`;
            rowData[dbKey] = cell.value;
        });

        try {
            if (type === 'siswa') {
                 if (!rowData.siswa_namaLengkap) throw new Error('Nama Lengkap wajib diisi.');
                 if (!rowData.siswa_nis) throw new Error('NIS wajib diisi.');
                 if (!rowData.siswa_nisn) throw new Error('NISN wajib diisi.');

                const [existing]: any = await db.query(
                    'SELECT id FROM siswa WHERE siswa_nis = ? OR siswa_nisn = ?',
                    [rowData.siswa_nis, rowData.siswa_nisn]
                );
                if (existing.length > 0) {
                    throw new Error(`NIS (${rowData.siswa_nis}) atau NISN (${rowData.siswa_nisn}) sudah ada.`);
                }
                await submitStudentData(rowData);
            } else if (type === 'pegawai') {
                 if (!rowData.pegawai_nama) throw new Error('Nama Lengkap wajib diisi.');
                 if (!rowData.pegawai_nip) throw new Error('NIP wajib diisi.');
                
                const [existing]: any = await db.query(
                    'SELECT id FROM pegawai WHERE pegawai_nip = ?',
                    [rowData.pegawai_nip]
                );
                if (existing.length > 0) {
                    throw new Error(`NIP ${rowData.pegawai_nip} sudah ada.`);
                }
                await submitPegawaiData(rowData);
            }
            results.successCount++;
        } catch (e: any) {
            results.failureCount++;
            results.errors.push({ row: i, reason: e.message || 'Error tidak diketahui' });
        }
    }
    
    db.release();

    if(results.failureCount > 0) {
        results.success = false;
        results.message = `Impor selesai dengan ${results.failureCount} error.`
    } else {
        results.message = `Berhasil mengimpor ${results.successCount} data.`
    }

    return results;
}

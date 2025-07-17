
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
        documents: typeof row.documents === 'string' ? JSON.parse(row.documents) : row.documents
    }));
}

export async function getSiswaById(id: string): Promise<Siswa | null> {
    const [rows] = await pool.query('SELECT * FROM siswa WHERE id = ?', [id]);
    const siswa = (rows as Siswa[])[0] || null;
    if (siswa) {
        siswa.documents = typeof siswa.documents === 'string' ? JSON.parse(siswa.documents) : siswa.documents;
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
        
        if (studentId) {
            // --- UPDATE LOGIC ---
            const { ...updateData } = sanitizedData;
            const isComplete = updateData.siswa_namaLengkap && updateData.siswa_nis && updateData.siswa_nisn;
            const status = isComplete ? 'Lengkap' : 'Belum Lengkap';
            
            const finalData = { ...updateData, status, documents: JSON.stringify(updateData.documents || {}) };
            
            const fields = Object.keys(finalData);
            const values = Object.values(finalData);

            const sql = `UPDATE siswa SET ${fields.map(f => `${f} = ?`).join(', ')} WHERE id = ?`;
            const queryValues = [...values, studentId];

            await pool.query(sql, queryValues);
            const message = `Data siswa ${finalData.siswa_namaLengkap} berhasil diperbarui!`;
            return { success: true, message };

        } else {
            // --- CREATE LOGIC ---
            const id = crypto.randomUUID();
            const isComplete = sanitizedData.siswa_namaLengkap && sanitizedData.siswa_nis && sanitizedData.siswa_nisn;
            const status = isComplete ? 'Lengkap' : 'Belum Lengkap';

            const finalData = { ...sanitizedData, id, status, documents: JSON.stringify(sanitizedData.documents || {}) };
            
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
     return (rows as Pegawai[]).map(row => ({
        ...row,
        pegawai_phaspoto: typeof row.pegawai_phaspoto === 'string' ? JSON.parse(row.pegawai_phaspoto) : row.pegawai_phaspoto,
        pegawai_pendidikanSD: typeof row.pegawai_pendidikanSD === 'string' ? JSON.parse(row.pegawai_pendidikanSD) : row.pegawai_pendidikanSD,
        pegawai_pendidikanSMP: typeof row.pegawai_pendidikanSMP === 'string' ? JSON.parse(row.pegawai_pendidikanSMP) : row.pegawai_pendidikanSMP,
        pegawai_pendidikanSMA: typeof row.pegawai_pendidikanSMA === 'string' ? JSON.parse(row.pegawai_pendidikanSMA) : row.pegawai_pendidikanSMA,
        pegawai_pendidikanDiploma: typeof row.pegawai_pendidikanDiploma === 'string' ? JSON.parse(row.pegawai_pendidikanDiploma) : row.pegawai_pendidikanDiploma,
        pegawai_pendidikanS1: typeof row.pegawai_pendidikanS1 === 'string' ? JSON.parse(row.pegawai_pendidikanS1) : row.pegawai_pendidikanS1,
        pegawai_pendidikanS2: typeof row.pegawai_pendidikanS2 === 'string' ? JSON.parse(row.pegawai_pendidikanS2) : row.pegawai_pendidikanS2,
        pegawai_skPengangkatan: typeof row.pegawai_skPengangkatan === 'string' ? JSON.parse(row.pegawai_skPengangkatan) : row.pegawai_skPengangkatan,
        pegawai_skNipBaru: typeof row.pegawai_skNipBaru === 'string' ? JSON.parse(row.pegawai_skNipBaru) : row.pegawai_skNipBaru,
        pegawai_skFungsional: typeof row.pegawai_skFungsional === 'string' ? JSON.parse(row.pegawai_skFungsional) : row.pegawai_skFungsional,
        pegawai_beritaAcaraSumpah: typeof row.pegawai_beritaAcaraSumpah === 'string' ? JSON.parse(row.pegawai_beritaAcaraSumpah) : row.pegawai_beritaAcaraSumpah,
        pegawai_sertifikatPendidik: typeof row.pegawai_sertifikatPendidik === 'string' ? JSON.parse(row.pegawai_sertifikatPendidik) : row.pegawai_sertifikatPendidik,
        pegawai_sertifikatPelatihan: typeof row.pegawai_sertifikatPelatihan === 'string' ? JSON.parse(row.pegawai_sertifikatPelatihan) : row.pegawai_sertifikatPelatihan,
        pegawai_skp: typeof row.pegawai_skp === 'string' ? JSON.parse(row.pegawai_skp) : row.pegawai_skp,
        pegawai_karpeg: typeof row.pegawai_karpeg === 'string' ? JSON.parse(row.pegawai_karpeg) : row.pegawai_karpeg,
        pegawai_karisKarsu: typeof row.pegawai_karisKarsu === 'string' ? JSON.parse(row.pegawai_karisKarsu) : row.pegawai_karisKarsu,
        pegawai_bukuNikah: typeof row.pegawai_bukuNikah === 'string' ? JSON.parse(row.pegawai_bukuNikah) : row.pegawai_bukuNikah,
        pegawai_kartuKeluarga: typeof row.pegawai_kartuKeluarga === 'string' ? JSON.parse(row.pegawai_kartuKeluarga) : row.pegawai_kartuKeluarga,
        pegawai_ktp: typeof row.pegawai_ktp === 'string' ? JSON.parse(row.pegawai_ktp) : row.pegawai_ktp,
        pegawai_akteKelahiran: typeof row.pegawai_akteKelahiran === 'string' ? JSON.parse(row.pegawai_akteKelahiran) : row.pegawai_akteKelahiran,
        pegawai_kartuTaspen: typeof row.pegawai_kartuTaspen === 'string' ? JSON.parse(row.pegawai_kartuTaspen) : row.pegawai_kartuTaspen,
        pegawai_npwp: typeof row.pegawai_npwp === 'string' ? JSON.parse(row.pegawai_npwp) : row.pegawai_npwp,
        pegawai_kartuBpjs: typeof row.pegawai_kartuBpjs === 'string' ? JSON.parse(row.pegawai_kartuBpjs) : row.pegawai_kartuBpjs,
        pegawai_bukuRekening: typeof row.pegawai_bukuRekening === 'string' ? JSON.parse(row.pegawai_bukuRekening) : row.pegawai_bukuRekening,
    }));
}

export async function getPegawaiById(id: string): Promise<Pegawai | null> {
    const [rows] = await pool.query('SELECT * FROM pegawai WHERE id = ?', [id]);
    const p = (rows as Pegawai[])[0] || null;
    if (p) {
        p.pegawai_phaspoto = typeof p.pegawai_phaspoto === 'string' ? JSON.parse(p.pegawai_phaspoto) : p.pegawai_phaspoto;
        p.pegawai_pendidikanSD = typeof p.pegawai_pendidikanSD === 'string' ? JSON.parse(p.pegawai_pendidikanSD) : p.pegawai_pendidikanSD;
        p.pegawai_pendidikanSMP = typeof p.pegawai_pendidikanSMP === 'string' ? JSON.parse(p.pegawai_pendidikanSMP) : p.pegawai_pendidikanSMP;
        p.pegawai_pendidikanSMA = typeof p.pegawai_pendidikanSMA === 'string' ? JSON.parse(p.pegawai_pendidikanSMA) : p.pegawai_pendidikanSMA;
        p.pegawai_pendidikanDiploma = typeof p.pegawai_pendidikanDiploma === 'string' ? JSON.parse(p.pegawai_pendidikanDiploma) : p.pegawai_pendidikanDiploma;
        p.pegawai_pendidikanS1 = typeof p.pegawai_pendidikanS1 === 'string' ? JSON.parse(p.pegawai_pendidikanS1) : p.pegawai_pendidikanS1;
        p.pegawai_pendidikanS2 = typeof p.pegawai_pendidikanS2 === 'string' ? JSON.parse(p.pegawai_pendidikanS2) : p.pegawai_pendidikanS2;
        p.pegawai_skPengangkatan = typeof p.pegawai_skPengangkatan === 'string' ? JSON.parse(p.pegawai_skPengangkatan) : p.pegawai_skPengangkatan;
        p.pegawai_skNipBaru = typeof p.pegawai_skNipBaru === 'string' ? JSON.parse(p.pegawai_skNipBaru) : p.pegawai_skNipBaru;
        p.pegawai_skFungsional = typeof p.pegawai_skFungsional === 'string' ? JSON.parse(p.pegawai_skFungsional) : p.pegawai_skFungsional;
        p.pegawai_beritaAcaraSumpah = typeof p.pegawai_beritaAcaraSumpah === 'string' ? JSON.parse(p.pegawai_beritaAcaraSumpah) : p.pegawai_beritaAcaraSumpah;
        p.pegawai_sertifikatPendidik = typeof p.pegawai_sertifikatPendidik === 'string' ? JSON.parse(p.pegawai_sertifikatPendidik) : p.pegawai_sertifikatPendidik;
        p.pegawai_sertifikatPelatihan = typeof p.pegawai_sertifikatPelatihan === 'string' ? JSON.parse(p.pegawai_sertifikatPelatihan) : p.pegawai_sertifikatPelatihan;
        p.pegawai_skp = typeof p.pegawai_skp === 'string' ? JSON.parse(p.pegawai_skp) : p.pegawai_skp;
        p.pegawai_karpeg = typeof p.pegawai_karpeg === 'string' ? JSON.parse(p.pegawai_karpeg) : p.pegawai_karpeg;
        p.pegawai_karisKarsu = typeof p.pegawai_karisKarsu === 'string' ? JSON.parse(p.pegawai_karisKarsu) : p.pegawai_karisKarsu;
        p.pegawai_bukuNikah = typeof p.pegawai_bukuNikah === 'string' ? JSON.parse(p.pegawai_bukuNikah) : p.pegawai_bukuNikah;
        p.pegawai_kartuKeluarga = typeof p.pegawai_kartuKeluarga === 'string' ? JSON.parse(p.pegawai_kartuKeluarga) : p.pegawai_kartuKeluarga;
        p.pegawai_ktp = typeof p.pegawai_ktp === 'string' ? JSON.parse(p.pegawai_ktp) : p.pegawai_ktp;
        p.pegawai_akteKelahiran = typeof p.pegawai_akteKelahiran === 'string' ? JSON.parse(p.pegawai_akteKelahiran) : p.pegawai_akteKelahiran;
        p.pegawai_kartuTaspen = typeof p.pegawai_kartuTaspen === 'string' ? JSON.parse(p.pegawai_kartuTaspen) : p.pegawai_kartuTaspen;
        p.pegawai_npwp = typeof p.pegawai_npwp === 'string' ? JSON.parse(p.pegawai_npwp) : p.pegawai_npwp;
        p.pegawai_kartuBpjs = typeof p.pegawai_kartuBpjs === 'string' ? JSON.parse(p.pegawai_kartuBpjs) : p.pegawai_kartuBpjs;
        p.pegawai_bukuRekening = typeof p.pegawai_bukuRekening === 'string' ? JSON.parse(p.pegawai_bukuRekening) : p.pegawai_bukuRekening;
    }
    return p;
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
        const id = pegawaiId || crypto.randomUUID();
        
        const status = sanitizedData.pegawai_nama && sanitizedData.pegawai_nip ? 'Lengkap' : 'Belum Lengkap';
        
        const finalData = { 
            ...sanitizedData, 
            id, 
            status,
            pegawai_phaspoto: JSON.stringify(sanitizedData.pegawai_phaspoto),
            pegawai_pendidikanSD: JSON.stringify(sanitizedData.pegawai_pendidikanSD),
            pegawai_pendidikanSMP: JSON.stringify(sanitizedData.pegawai_pendidikanSMP),
            pegawai_pendidikanSMA: JSON.stringify(sanitizedData.pegawai_pendidikanSMA),
            pegawai_pendidikanDiploma: JSON.stringify(sanitizedData.pegawai_pendidikanDiploma),
            pegawai_pendidikanS1: JSON.stringify(sanitizedData.pegawai_pendidikanS1),
            pegawai_pendidikanS2: JSON.stringify(sanitizedData.pegawai_pendidikanS2),
            pegawai_skPengangkatan: JSON.stringify(sanitizedData.pegawai_skPengangkatan),
            pegawai_skNipBaru: JSON.stringify(sanitizedData.pegawai_skNipBaru),
            pegawai_skFungsional: JSON.stringify(sanitizedData.pegawai_skFungsional),
            pegawai_beritaAcaraSumpah: JSON.stringify(sanitizedData.pegawai_beritaAcaraSumpah),
            pegawai_sertifikatPendidik: JSON.stringify(sanitizedData.pegawai_sertifikatPendidik),
            pegawai_sertifikatPelatihan: JSON.stringify(sanitizedData.pegawai_sertifikatPelatihan),
            pegawai_skp: JSON.stringify(sanitizedData.pegawai_skp),
            pegawai_karpeg: JSON.stringify(sanitizedData.pegawai_karpeg),
            pegawai_karisKarsu: JSON.stringify(sanitizedData.pegawai_karisKarsu),
            pegawai_bukuNikah: JSON.stringify(sanitizedData.pegawai_bukuNikah),
            pegawai_kartuKeluarga: JSON.stringify(sanitizedData.pegawai_kartuKeluarga),
            pegawai_ktp: JSON.stringify(sanitizedData.pegawai_ktp),
            pegawai_akteKelahiran: JSON.stringify(sanitizedData.pegawai_akteKelahiran),
            pegawai_kartuTaspen: JSON.stringify(sanitizedData.pegawai_kartuTaspen),
            pegawai_npwp: JSON.stringify(sanitizedData.pegawai_npwp),
            pegawai_kartuBpjs: JSON.stringify(sanitizedData.pegawai_kartuBpjs),
            pegawai_bukuRekening: JSON.stringify(sanitizedData.pegawai_bukuRekening),
        };
        
        const { id: _, ...updateData } = finalData;

        if (pegawaiId) {
             const fields = Object.keys(updateData).map(f => `${f} = ?`).join(', ');
             const values = Object.values(updateData);
             const sql = `UPDATE pegawai SET ${fields} WHERE id = ?`;
             const queryValues = [...values, pegawaiId];
             await pool.query(sql, queryValues);
        } else {
             const fields = Object.keys(finalData);
             const values = Object.values(finalData);
             const sql = `INSERT INTO pegawai (${fields.join(', ')}) VALUES (${values.map(() => '?').join(', ')})`;
             await pool.query(sql, values);
        }

        const message = pegawaiId ? `Data pegawai ${finalData.pegawai_nama} berhasil diperbarui!` : `Data pegawai ${finalData.pegawai_nama} berhasil disimpan!`;

        return { success: true, message };
    } catch (error: any) {
        console.error("Pegawai submission server error:", error);
        return { success: false, message: `Gagal menyimpan data pegawai karena kesalahan server: ${error.message}` };
    }
}

    
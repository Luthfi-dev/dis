
'use server';

import { studentFormSchema, completeStudentFormSchema, StudentFormData } from '@/lib/schema';
import { pegawaiFormSchema, completePegawaiFormSchema, PegawaiFormData } from '@/lib/pegawai-schema';
import { z } from 'zod';
import type { Siswa } from './data';
import type { Pegawai } from './pegawai-data';
import { mergeDeep } from './utils';

// --- Server-side Storage Simulation ---
if (typeof global.students === 'undefined') {
    (global as any).students = [];
}
if (typeof global.pegawai === 'undefined') {
    (global as any).pegawai = [];
}
const allStudents: Siswa[] = (global as any).students;
const allPegawai: Pegawai[] = (global as any).pegawai;


// --- Public-facing Server Actions ---

// SISWA ACTIONS
export async function getSiswa(): Promise<Siswa[]> {
    return allStudents;
}

export async function getSiswaById(id: string): Promise<Siswa | null> {
    const student = allStudents.find(s => s.id === id) || null;
    return student;
}

export async function deleteSiswa(id: string): Promise<{ success: boolean; message: string }> {
    const studentIndex = allStudents.findIndex(s => s.id === id);
    if (studentIndex > -1) {
        const studentName = allStudents[studentIndex].siswa_namaLengkap;
        allStudents.splice(studentIndex, 1);
        return { success: true, message: `Data siswa ${studentName} berhasil dihapus.` };
    }
    return { success: false, message: 'Gagal menghapus data siswa.' };
}

export async function submitStudentData(data: StudentFormData, studentId?: string) {
    try {
        const validationResult = studentFormSchema.safeParse(data);

        if (!validationResult.success) {
            const errorPath = validationResult.error.issues[0]?.path.join('.') || 'unknown';
            const errorMessage = `Data Tidak Valid. Silakan periksa kolom berikut: ${errorPath}`;
            console.error("Student validation failed:", validationResult.error.flatten());
            return {
                success: false,
                message: errorMessage
            };
        }

        const validatedData = validationResult.data;
        const id = studentId || crypto.randomUUID();

        const isComplete = completeStudentFormSchema.safeParse(validatedData).success;
        const status = isComplete ? 'Lengkap' : 'Belum Lengkap';
        
        const existingData = await getSiswaById(id);
        const finalData: Siswa = mergeDeep(existingData || {}, { ...validatedData, id, status });

        const existingStudentIndex = allStudents.findIndex(s => s.id === id);

        if (existingStudentIndex !== -1) {
            allStudents[existingStudentIndex] = finalData;
        } else {
            allStudents.push(finalData);
        }

        const message = studentId ? `Data siswa ${finalData.siswa_namaLengkap} berhasil diperbarui!` : `Data siswa ${finalData.siswa_namaLengkap} berhasil disimpan!`;
        
        return { success: true, message, student: finalData };
    } catch (error: any) {
        console.error("Student submission server error:", error);
        return { success: false, message: `Gagal menyimpan data siswa karena kesalahan server: ${error.message}` };
    }
}


// PEGAWAI ACTIONS
export async function getPegawai(): Promise<Pegawai[]> {
    return allPegawai;
}

export async function getPegawaiById(id: string): Promise<Pegawai | null> {
    const p = allPegawai.find(p => p.id === id) || null;
    return p;
}

export async function deletePegawai(id: string): Promise<{ success: boolean; message: string }> {
    const pegawaiIndex = allPegawai.findIndex(p => p.id === id);
    if (pegawaiIndex > -1) {
        const pegawaiName = allPegawai[pegawaiIndex].pegawai_nama;
        allPegawai.splice(pegawaiIndex, 1);
        return { success: true, message: `Data pegawai ${pegawaiName} berhasil dihapus.` };
    }
    return { success: false, message: 'Gagal menghapus data pegawai.' };
}

export async function submitPegawaiData(data: PegawaiFormData, pegawaiId?: string) {
    // SMOKE TEST: Ignore incoming data and try to validate a "perfect" hardcoded object.
    const perfectData: PegawaiFormData = {
        pegawai_nama: 'Pegawai Tes Sukses',
        pegawai_jenisKelamin: 'Laki-laki',
        pegawai_tempatLahir: 'Jakarta',
        pegawai_tanggalLahir: '1990-01-01',
        pegawai_statusPerkawinan: 'Kawin',
        pegawai_jabatan: 'Guru Mata Pelajaran',
        pegawai_terhitungMulaiTanggal: '2020-01-01',
        pegawai_phaspoto: undefined,
        pegawai_nip: '123456789012345678',
        pegawai_nuptk: '1234567890123456',
        pegawai_nrg: '0987654321',
        pegawai_tanggalPerkawinan: '2015-01-01',
        pegawai_namaPasangan: 'Pasangan Tes',
        pegawai_jumlahAnak: 2,
        pegawai_bidangStudi: 'Fisika',
        pegawai_tugasTambahan: 'Kepala LAB',
        pegawai_alamatDusun: 'Dusun ABC',
        pegawai_alamatDesa: '3273011001',
        pegawai_alamatKecamatan: '327301',
        pegawai_alamatKabupaten: '3273',
        pegawai_pendidikanSD: { tamatTahun: '2002' },
        pegawai_pendidikanSMP: { tamatTahun: '2005' },
        pegawai_pendidikanSMA: { tamatTahun: '2008' },
        pegawai_pendidikanS1: { tamatTahun: '2012' },
        pegawai_skPengangkatan: [],
        pegawai_skFungsional: [],
        pegawai_sertifikatPelatihan: [],
        pegawai_skp: [],
    };

    try {
        console.log('--- STARTING SMOKE TEST ---');
        const validationResult = pegawaiFormSchema.safeParse(perfectData);

        if (!validationResult.success) {
            const flatErrors = validationResult.error.flatten();
            const errorMessages = Object.entries(flatErrors.fieldErrors)
                .map(([key, value]) => `${key}: ${value.join(', ')}`)
                .join('; ');

            console.error("SMOKE TEST FAILED:", JSON.stringify(validationResult.error, null, 2));
            return {
                success: false,
                message: `Tes validasi gagal: ${errorMessages || 'Error tidak diketahui'}`
            };
        }

        console.log('--- SMOKE TEST VALIDATION PASSED ---');
        
        const validatedData = validationResult.data;
        const id = pegawaiId || 'smoke-test-pegawai';

        const isComplete = completePegawaiFormSchema.safeParse(validatedData).success;
        const status = isComplete ? 'Lengkap' : 'Belum Lengkap';
        
        const existingData = await getPegawaiById(id);
        const finalData: Pegawai = mergeDeep(existingData || {}, { ...validatedData, id, status });
        
        const existingPegawaiIndex = allPegawai.findIndex(p => p.id === id);

        if (existingPegawaiIndex !== -1) {
            allPegawai[existingPegawaiIndex] = finalData;
        } else {
            allPegawai.push(finalData);
        }

        const message = "Tes Asap Berhasil! Data dummy berhasil disimpan.";

        return { success: true, message, pegawai: finalData };
    } catch (error: any) {
        console.error("SMOKE TEST CAUGHT UNEXPECTED ERROR:", error);
        return { success: false, message: `Tes validasi mengalami kesalahan tak terduga: ${error.message}` };
    }
}

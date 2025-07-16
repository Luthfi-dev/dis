
'use server';

import { studentFormSchema, completeStudentFormSchema, StudentFormData } from '@/lib/schema';
import { pegawaiFormSchema, completePegawaiFormSchema, PegawaiFormData } from '@/lib/pegawai-schema';
import { z } from 'zod';
import type { Siswa } from './data';
import type { Pegawai } from './pegawai-data';
import { logActivity } from './activity-log';
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
        logActivity(`Data siswa ${studentName} telah dihapus.`);
        return { success: true, message: 'Data siswa berhasil dihapus.' };
    }
    return { success: false, message: 'Gagal menghapus data siswa.' };
}

export async function submitStudentData(data: StudentFormData, studentId?: string) {
    try {
        const validationResult = studentFormSchema.safeParse(data);
        if (!validationResult.success) {
            const errorDetails = validationResult.error.flatten().fieldErrors;
            const errorMessages = Object.entries(errorDetails).map(([key, value]) => `${key}: ${value?.join(', ')}`).join('; ');
            const finalMessage = `Data tidak valid. ${errorMessages || 'Terjadi kesalahan validasi umum, silakan periksa kembali seluruh data.'}`;
            
            console.error("Student Validation Error:", errorDetails);
            
            return {
                success: false,
                message: finalMessage,
                errors: errorDetails,
            };
        }

        const parsedData = validationResult.data;
        const id = studentId || crypto.randomUUID();

        if (parsedData.siswa_nisn && !studentId) {
            if (allStudents.some(s => s.siswa_nisn === parsedData.siswa_nisn)) {
                return { success: false, message: 'NISN sudah digunakan oleh siswa lain.' };
            }
        }

        const completionResult = completeStudentFormSchema.safeParse(data);
        const status = completionResult.success ? 'Lengkap' : 'Belum Lengkap';
        
        const existingData = await getSiswaById(id);
        const finalData: Siswa = mergeDeep(existingData || {}, { ...parsedData, id, status });

        const existingStudentIndex = allStudents.findIndex(s => s.id === id);

        if (existingStudentIndex !== -1) {
            allStudents[existingStudentIndex] = finalData;
        } else {
            allStudents.push(finalData);
        }

        const message = studentId ? `Data siswa ${finalData.siswa_namaLengkap} berhasil diperbarui!` : `Data siswa ${finalData.siswa_namaLengkap} berhasil disimpan!`;
        logActivity(message);

        return { success: true, message, student: finalData };
    } catch (error: any) {
        const errorMessage = `Kesalahan Server: ${error.name} - ${error.message}`;
        console.error("Student submission server error:", {
            message: error.message,
            name: error.name,
            stack: error.stack,
            error: error,
        });
        return { success: false, message: `Gagal menyimpan data siswa karena ${errorMessage}` };
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
        logActivity(`Data pegawai ${pegawaiName} telah dihapus.`);
        return { success: true, message: 'Data pegawai berhasil dihapus.' };
    }
    return { success: false, message: 'Gagal menghapus data pegawai.' };
}


export async function submitPegawaiData(data: PegawaiFormData, pegawaiId?: string) {
    // SMOKE TEST: Ignore all incoming data and just try to save a hardcoded object.
    // This is to prove if the client-server action connection itself is working without
    // any interference from complex data or validation.
    
    const hardcodedPegawai: Pegawai = {
        id: pegawaiId || crypto.randomUUID(),
        pegawai_nama: 'Pegawai Tes Sukses',
        pegawai_jenisKelamin: 'Laki-laki',
        pegawai_tempatLahir: 'Test',
        pegawai_tanggalLahir: new Date().toISOString(),
        pegawai_statusPerkawinan: 'Kawin',
        pegawai_jabatan: 'Guru',
        pegawai_terhitungMulaiTanggal: new Date().toISOString(),
        status: 'Lengkap',
    };

    const existingPegawaiIndex = allPegawai.findIndex(p => p.id === hardcodedPegawai.id);

    if (existingPegawaiIndex !== -1) {
        allPegawai[existingPegawaiIndex] = hardcodedPegawai;
    } else {
        allPegawai.push(hardcodedPegawai);
    }
    
    logActivity(`Data pegawai tes ${hardcodedPegawai.pegawai_nama} berhasil disimpan.`);

    return { success: true, message: "Data tes berhasil disimpan!" };
}

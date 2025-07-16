
'use server';

import { studentFormSchema, completeStudentFormSchema, StudentFormData } from '@/lib/schema';
import { pegawaiFormSchema, completePegawaiFormSchema, PegawaiFormData } from '@/lib/pegawai-schema';
import { z } from 'zod';
import type { Siswa } from './data';
import type { Pegawai } from './pegawai-data';
import { logActivity } from './activity-log';


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
            console.error("Zod Validation Error in submitStudentData:", validationResult.error.flatten());
            return {
                success: false,
                message: "Data tidak valid.",
                errors: validationResult.error.flatten().fieldErrors,
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

        const finalData: Siswa = { ...parsedData, id, status };
        const existingStudentIndex = allStudents.findIndex(s => s.id === id);

        if (existingStudentIndex !== -1) {
            allStudents[existingStudentIndex] = finalData;
        } else {
            allStudents.push(finalData);
        }

        const message = studentId ? `Data siswa ${finalData.siswa_namaLengkap} berhasil diperbarui!` : `Data siswa ${finalData.siswa_namaLengkap} berhasil disimpan!`;
        logActivity(message);

        return { success: true, message, student: finalData };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error("Student submission server error:", {
            message: errorMessage,
            error: error,
        });
        return { success: false, message: `Gagal menyimpan data siswa karena kesalahan server: ${errorMessage}` };
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
    try {
        // We removed client-side validation, so we must validate here.
        const validationResult = pegawaiFormSchema.safeParse(data);
        if (!validationResult.success) {
            const errorMessage = `Data tidak valid. Periksa kolom: ${Object.keys(validationResult.error.flatten().fieldErrors).join(', ')}`;
            console.error("Zod Validation Error in submitPegawaiData:", {
                message: errorMessage,
                errors: validationResult.error.flatten().fieldErrors,
            });
            return { success: false, message: errorMessage, errors: validationResult.error.flatten().fieldErrors };
        }

        const parsedData = validationResult.data;
        const id = pegawaiId || crypto.randomUUID();

        if (parsedData.pegawai_nip && !pegawaiId) {
            if (allPegawai.some(p => p.pegawai_nip === parsedData.pegawai_nip)) {
                return { success: false, message: "NIP sudah digunakan oleh pegawai lain." };
            }
        }
        
        const completionResult = completePegawaiFormSchema.safeParse(data);
        const status = completionResult.success ? 'Lengkap' : 'Belum Lengkap';
        
        const finalData: Pegawai = { ...parsedData, id, status };

        const existingPegawaiIndex = allPegawai.findIndex(p => p.id === id);

        if (existingPegawaiIndex !== -1) {
            // Simple replacement, no more merging
            allPegawai[existingPegawaiIndex] = finalData;
        } else {
            allPegawai.push(finalData);
        }

        const message = pegawaiId ? `Data pegawai ${finalData.pegawai_nama} berhasil diperbarui!` : `Data pegawai ${finalData.pegawai_nama} berhasil disimpan!`;
        logActivity(message);

        return { success: true, message, pegawai: finalData };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Pegawai submission server error:', {
        message: errorMessage,
        error: error
      });
      return { success: false, message: `Gagal menyimpan data karena kesalahan server: ${errorMessage}` };
    }
  }

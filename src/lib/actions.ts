
'use server';

import { suggestUploadCategory } from '@/ai/flows/suggest-upload-category';
import { studentFormSchema, completeStudentFormSchema, StudentFormData } from '@/lib/schema';
import { pegawaiFormSchema, completePegawaiFormSchema, PegawaiFormData } from '@/lib/pegawai-schema';
import { z } from 'zod';
import type { Siswa } from './data';
import type { Pegawai } from './pegawai-data';
import { logActivity } from './activity-log';

// --- Server-side Storage Simulation ---
// In a real app, this would be a database.
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

export async function getCategorySuggestion(description: string) {
  if (!description) {
    return { success: false, error: 'Description is required.' };
  }
  try {
    const result = await suggestUploadCategory({ documentDescription: description });
    return { success: true, category: result.suggestedCategory };
  } catch (error) {
    console.error('Error getting category suggestion:', error);
    return { success: false, error: 'Failed to get suggestion from AI.' };
  }
}

export async function submitStudentData(data: StudentFormData, studentId?: string) {
  try {
    const parsedData = studentFormSchema.parse(data);
    
    // Check for NISN duplicates
    if (parsedData.siswa_nisn) {
        if (studentId) { // Editing
            if (allStudents.some(s => s.siswa_nisn === parsedData.siswa_nisn && s.id !== studentId)) {
                return { success: false, message: 'NISN sudah digunakan oleh siswa lain.' };
            }
        } else { // Adding
             if (allStudents.some(s => s.siswa_nisn === parsedData.siswa_nisn)) {
                return { success: false, message: 'NISN sudah terdaftar.' };
            }
        }
    }

    const completionResult = completeStudentFormSchema.safeParse(parsedData);
    const status = completionResult.success ? 'Lengkap' : 'Belum Lengkap';
    
    const finalData: Siswa = { 
        ...parsedData, 
        id: studentId || crypto.randomUUID(), 
        status 
    };
    
    if (studentId) {
        const index = allStudents.findIndex(s => s.id === studentId);
        if (index !== -1) allStudents[index] = finalData;
    } else {
        allStudents.push(finalData);
    }

    const message = studentId ? `Data siswa ${finalData.siswa_namaLengkap} berhasil diperbarui!` : `Data siswa ${finalData.siswa_namaLengkap} berhasil disimpan!`;
    logActivity(message);

    return { success: true, message, student: finalData };

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.errors)
      return { success: false, message: 'Data tidak valid. Periksa kembali isian Anda.', errors: error.errors };
    }
    console.error('Student submission error:', error);
    return { success: false, message: 'Gagal menyimpan data siswa.' };
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
        const parsedData = pegawaiFormSchema.parse(data);

        // Check for duplicates
        if (parsedData.pegawai_nip) {
            if (pegawaiId) { // Editing
                 if (allPegawai.some(p => p.pegawai_nip === parsedData.pegawai_nip && p.id !== pegawaiId)) {
                    return { success: false, message: "NIP sudah digunakan oleh pegawai lain." };
                }
            } else { // Adding
                if (allPegawai.some(p => p.pegawai_nip === parsedData.pegawai_nip)) {
                    return { success: false, message: "NIP sudah terdaftar." };
                }
            }
        }
        if (parsedData.pegawai_nuptk) {
             if (pegawaiId) { // Editing
                if (allPegawai.some(p => p.pegawai_nuptk === parsedData.pegawai_nuptk && p.id !== pegawaiId)) {
                    return { success: false, message: "NUPTK sudah digunakan oleh pegawai lain." };
                }
            } else { // Adding
                if (allPegawai.some(p => p.pegawai_nuptk === parsedData.pegawai_nuptk)) {
                    return { success: false, message: "NUPTK sudah terdaftar." };
                }
            }
        }

        const completionResult = completePegawaiFormSchema.safeParse(parsedData);
        const status = completionResult.success ? 'Lengkap' : 'Belum Lengkap';

        const finalData: Pegawai = {
            ...parsedData,
            id: pegawaiId || crypto.randomUUID(),
            status,
        };

        if (pegawaiId) {
            const index = allPegawai.findIndex(p => (p.id === pegawaiId));
            if (index !== -1) allPegawai[index] = finalData;
        } else {
            allPegawai.push(finalData);
        }

        const message = pegawaiId ? `Data pegawai ${finalData.pegawai_nama} berhasil diperbarui!` : `Data pegawai ${finalData.pegawai_nama} berhasil disimpan!`;
        logActivity(message);

        return { success: true, message: message, pegawai: finalData };

    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Pegawai validation error:', error.flatten().fieldErrors);
        return { success: false, message: 'Data tidak valid. Periksa kembali isian Anda.', errors: error.errors };
      }
      console.error('Pegawai submission error:', error);
      return { success: false, message: 'Gagal menyimpan data pegawai.' };
    }
  }

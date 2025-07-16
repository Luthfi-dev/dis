
'use server';

import { suggestUploadCategory } from '@/ai/flows/suggest-upload-category';
import { studentFormSchema, completeStudentFormSchema, StudentFormData } from '@/lib/schema';
import { pegawaiFormSchema, completePegawaiFormSchema, PegawaiFormData } from '@/lib/pegawai-schema';
import { z } from 'zod';
import type { Siswa } from './data';
import type { Pegawai } from './pegawai-data';
import { logActivity } from './activity-log';

// --- Server-side simulation of data storage ---

const getStudentsFromStorage = (): Siswa[] => {
    // This is a placeholder for actual database/storage logic.
    // NOTE: This runs on the server, so it can't access client-side localStorage.
    // We need a server-side "database" simulation if we aren't using a real one.
    // For now, this will be empty on each server restart. This is a key
    // concept to understand for server-driven apps.
    // To make this work for demo, we will use a global variable.
    if (!global.students) global.students = [];
    return global.students;
};
const saveStudentsToStorage = (students: Siswa[]) => {
    global.students = students;
};

const getPegawaiFromStorage = (): Pegawai[] => {
    if (!global.pegawai) global.pegawai = [];
    return global.pegawai;
};
const savePegawaiToStorage = (pegawai: Pegawai[]) => {
    global.pegawai = pegawai;
};

// --- Public-facing Server Actions ---

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
    const allStudents = getStudentsFromStorage(); 
    
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
    
    let updatedStudents;
    if (studentId) {
        updatedStudents = allStudents.map(s => s.id === studentId ? finalData : s);
    } else {
        updatedStudents = [...allStudents, finalData];
    }
    saveStudentsToStorage(updatedStudents);

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

export async function submitPegawaiData(data: PegawaiFormData, pegawaiId?: string) {
    try {
        const parsedData = pegawaiFormSchema.parse(data);
        const allPegawai = getPegawaiFromStorage();

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

        let updatedPegawai;
        if (pegawaiId) {
            updatedPegawai = allPegawai.map(p => (p.id === pegawaiId ? finalData : p));
        } else {
            updatedPegawai = [...allPegawai, finalData];
        }
        savePegawaiToStorage(updatedPegawai);

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

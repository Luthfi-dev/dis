
'use server';

import { suggestUploadCategory } from '@/ai/flows/suggest-upload-category';
import { studentFormSchema, completeStudentFormSchema, StudentFormData } from '@/lib/schema';
import { pegawaiFormSchema, completePegawaiFormSchema, PegawaiFormData } from '@/lib/pegawai-schema';
import { z } from 'zod';
import type { Siswa } from './data';
import type { Pegawai } from './pegawai-data';
import { logActivity } from './activity-log';

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

const getStudentsFromStorage = (): Siswa[] => {
    // This is a placeholder for actual database/storage logic.
    // For now, it mimics reading from a persistent store.
    // In a real app, you'd fetch from your database here.
    return []; // Start with empty for server-side validation context
};
const saveStudentsToStorage = (students: Siswa[]) => {
    // Placeholder for saving to a database.
};

const getPegawaiFromStorage = (): Pegawai[] => {
    return [];
};
const savePegawaiToStorage = (pegawai: Pegawai[]) => {
    // Placeholder
};


export async function submitStudentData(data: StudentFormData, studentId?: string) {
  try {
    const parsedData = studentFormSchema.parse(data);
    
    // In a real scenario, this would be a database call.
    // We are simulating it here. LocalStorage logic will be on client.
    const allStudents: Siswa[] = getStudentsFromStorage(); 
    
    if (!studentId) { // Check for duplicates only on creation
        if (allStudents.some(s => s.siswa_nisn === parsedData.siswa_nisn)) {
            return { success: false, message: 'NISN sudah terdaftar.' };
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
    saveStudentsToStorage(updatedStudents); // Simulate saving

    const message = studentId ? `Data siswa ${finalData.siswa_namaLengkap} berhasil diperbarui!` : `Data siswa ${finalData.siswa_namaLengkap} berhasil disimpan!`;
    logActivity(message);

    return { success: true, message, student: finalData };

  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: 'Data tidak valid.', errors: error.errors };
    }
    console.error('Submission error:', error);
    return { success: false, message: 'Gagal menyimpan data siswa.' };
  }
}

export async function submitPegawaiData(data: PegawaiFormData, pegawaiId?: string) {
    try {
        const parsedData = pegawaiFormSchema.parse(data);

        // This would be a DB call in a real app
        const allPegawai: Pegawai[] = getPegawaiFromStorage();

        if (!pegawaiId) { // Check for duplicates only when creating new
            if (parsedData.pegawai_nip && allPegawai.some(p => p.pegawai_nip === parsedData.pegawai_nip)) {
                return { success: false, message: "NIP sudah terdaftar." };
            }
            if (parsedData.pegawai_nuptk && allPegawai.some(p => p.pegawai_nuptk === parsedData.pegawai_nuptk)) {
                return { success: false, message: "NUPTK sudah terdaftar." };
            }
        }

        const completionResult = completePegawaiFormSchema.safeParse(parsedData);
        const status = completionResult.success ? 'Lengkap' : 'Belum Lengkap';

        const finalData: Pegawai = {
            ...parsedData,
            id: pegawaiId || crypto.randomUUID(),
            status,
        };

        // This is a placeholder for the actual save operation
        let updatedPegawai;
        if (pegawaiId) {
            updatedPegawai = allPegawai.map(p => p.id === pegawaiId ? finalData : p);
        } else {
            updatedPegawai = [...allPegawai, finalData];
        }
        savePegawaiToStorage(updatedPegawai);


        const message = pegawaiId ? `Data pegawai ${finalData.pegawai_nama} berhasil diperbarui!` : `Data pegawai ${finalData.pegawai_nama} berhasil disimpan!`;
        logActivity(message);

        return { success: true, message: message, pegawai: finalData };

    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error:', error.errors);
        return { success: false, message: 'Data tidak valid.', errors: error.errors };
      }
      console.error('Submission error:', error);
      return { success: false, message: 'Gagal menyimpan data pegawai.' };
    }
  }

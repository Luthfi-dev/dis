
'use server';

import { suggestUploadCategory } from '@/ai/flows/suggest-upload-category';
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

export async function submitStudentData(data: Partial<StudentFormData>, studentId?: string, isDraft: boolean = false) {
  try {
    const schemaToUse = isDraft ? studentFormSchema.deepPartial() : studentFormSchema;
    const parsedData = schemaToUse.parse(data);

    if (parsedData.siswa_nisn) {
      const existingStudent = allStudents.find(s => s.siswa_nisn === parsedData.siswa_nisn);
      if (existingStudent && existingStudent.id !== studentId) {
        return { success: false, message: 'NISN sudah digunakan oleh siswa lain.' };
      }
    }

    const id = studentId || crypto.randomUUID();
    const existingStudentIndex = allStudents.findIndex(s => s.id === id);

    let finalData: Siswa;

    if (existingStudentIndex !== -1) {
      const mergedData = mergeDeep({}, allStudents[existingStudentIndex], parsedData);
      const completionResult = completeStudentFormSchema.safeParse(mergedData);
      const status = isDraft ? 'Belum Lengkap' : (completionResult.success ? 'Lengkap' : 'Belum Lengkap');
      finalData = { ...mergedData, id, status };
      allStudents[existingStudentIndex] = finalData;
    } else {
      const completionResult = completeStudentFormSchema.safeParse(parsedData);
      const status = isDraft ? 'Belum Lengkap' : (completionResult.success ? 'Lengkap' : 'Belum Lengkap');
      finalData = { ...(parsedData as StudentFormData), id, status };
      allStudents.push(finalData);
    }
    
    let message: string;
    if (isDraft) {
        message = `Draf untuk ${finalData.siswa_namaLengkap || 'siswa baru'} berhasil disimpan.`;
    } else {
        message = studentId ? `Data siswa ${finalData.siswa_namaLengkap} berhasil diperbarui!` : `Data siswa ${finalData.siswa_namaLengkap} berhasil disimpan!`;
        logActivity(message);
    }

    return { success: true, message, student: finalData };

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Zod Validation Error in submitStudentData:", error.flatten().fieldErrors);
      const errorMessages = Object.entries(error.flatten().fieldErrors).map(([field, errors]) => `${field}: ${errors.join(', ')}`).join('; ');
      return { success: false, message: `Data tidak valid. Kesalahan: ${errorMessages}`, errors: error.flatten().fieldErrors };
    }
    console.error('Student submission server error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
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


export async function submitPegawaiData(data: Partial<PegawaiFormData>, pegawaiId?: string, isDraft: boolean = false) {
    try {
        const schemaToUse = isDraft ? pegawaiFormSchema.deepPartial() : pegawaiFormSchema;
        const parsedData = schemaToUse.parse(data);

        if (parsedData.pegawai_nip) {
            const existingPegawai = allPegawai.find(p => p.pegawai_nip === parsedData.pegawai_nip);
            if (existingPegawai && existingPegawai.id !== pegawaiId) {
                return { success: false, message: "NIP sudah digunakan oleh pegawai lain." };
            }
        }
        if (parsedData.pegawai_nuptk) {
            const existingPegawai = allPegawai.find(p => p.pegawai_nuptk === parsedData.pegawai_nuptk);
             if (existingPegawai && existingPegawai.id !== pegawaiId) {
                return { success: false, message: "NUPTK sudah digunakan oleh pegawai lain." };
            }
        }

        const id = pegawaiId || crypto.randomUUID();
        const existingPegawaiIndex = allPegawai.findIndex(p => p.id === id);
        
        let finalData: Pegawai;

        if (existingPegawaiIndex !== -1) {
            const mergedData = mergeDeep({}, allPegawai[existingPegawaiIndex], parsedData);
            const completionResult = completePegawaiFormSchema.safeParse(mergedData);
            const status = isDraft ? 'Belum Lengkap' : (completionResult.success ? 'Lengkap' : 'Belum Lengkap');
            finalData = { ...mergedData, id, status };
            allPegawai[existingPegawaiIndex] = finalData;
        } else {
            const completionResult = completePegawaiFormSchema.safeParse(parsedData);
            const status = isDraft ? 'Belum Lengkap' : (completionResult.success ? 'Lengkap' : 'Belum Lengkap');
            finalData = { ...(parsedData as PegawaiFormData), id, status };
            allPegawai.push(finalData);
        }

        let message: string;
        if (isDraft) {
            message = `Draf untuk ${finalData.pegawai_nama || 'pegawai baru'} berhasil disimpan.`;
        } else {
            message = pegawaiId ? `Data pegawai ${finalData.pegawai_nama} berhasil diperbarui!` : `Data pegawai ${finalData.pegawai_nama} berhasil disimpan!`;
            logActivity(message);
        }

        return { success: true, message: message, pegawai: finalData };

    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Zod Validation Error in submitPegawaiData:", error.flatten().fieldErrors);
        const errorMessages = Object.entries(error.flatten().fieldErrors).map(([field, errors]) => `${field}: ${errors.join(', ')}`).join('; ');
        return { success: false, message: `Data tidak valid. Kesalahan: ${errorMessages}`, errors: error.flatten().fieldErrors };
      }
      console.error('Pegawai submission server error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { success: false, message: `Gagal menyimpan data draf karena kesalahan server: ${errorMessage}` };
    }
  }


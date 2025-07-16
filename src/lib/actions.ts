
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

export async function submitStudentData(data: Partial<StudentFormData>, studentId?: string, isDraft: boolean = false) {
  try {
    const schemaToUse = isDraft ? studentFormSchema.deepPartial() : studentFormSchema;
    const parsedData = schemaToUse.parse(data);

    // Check for NISN duplicates
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
      // Update existing student
      const updatedData = { ...allStudents[existingStudentIndex], ...parsedData };
      const completionResult = completeStudentFormSchema.safeParse(updatedData);
      const status = isDraft ? 'Belum Lengkap' : (completionResult.success ? 'Lengkap' : 'Belum Lengkap');
      finalData = { ...updatedData, id, status };
      allStudents[existingStudentIndex] = finalData;
    } else {
      // Create new student
      const newStudentData = { ...(data as StudentFormData), ...parsedData };
      const completionResult = completeStudentFormSchema.safeParse(newStudentData);
      const status = isDraft ? 'Belum Lengkap' : (completionResult.success ? 'Lengkap' : 'Belum Lengkap');
      finalData = { ...newStudentData, id, status };
      allStudents.push(finalData);
    }
    
    let message: string;
    if (isDraft) {
        message = `Draf untuk ${finalData.siswa_namaLengkap} berhasil disimpan.`;
    } else {
        message = studentId ? `Data siswa ${finalData.siswa_namaLengkap} berhasil diperbarui!` : `Data siswa ${finalData.siswa_namaLengkap} berhasil disimpan!`;
        logActivity(message);
    }

    return { success: true, message, student: finalData };

  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: 'Data tidak valid. Periksa kembali isian Anda.', errors: error.flatten().fieldErrors };
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


export async function submitPegawaiData(data: Partial<PegawaiFormData>, pegawaiId?: string, isDraft: boolean = false) {
    try {
        const schemaToUse = isDraft ? pegawaiFormSchema.deepPartial() : pegawaiFormSchema;
        const parsedData = schemaToUse.parse(data);

        // Check for duplicates
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
            const updatedData = { ...allPegawai[existingPegawaiIndex], ...parsedData };
            const completionResult = completePegawaiFormSchema.safeParse(updatedData);
            const status = isDraft ? 'Belum Lengkap' : (completionResult.success ? 'Lengkap' : 'Belum Lengkap');
            finalData = { ...updatedData, id, status };
            allPegawai[existingPegawaiIndex] = finalData;
        } else {
            const newPegawaiData = { ...(data as PegawaiFormData), ...parsedData };
            const completionResult = completePegawaiFormSchema.safeParse(newPegawaiData);
            const status = isDraft ? 'Belum Lengkap' : (completionResult.success ? 'Lengkap' : 'Belum Lengkap');
            finalData = { ...newPegawaiData, id, status };
            allPegawai.push(finalData);
        }

        let message: string;
        if (isDraft) {
            message = `Draf untuk ${finalData.pegawai_nama} berhasil disimpan.`;
        } else {
            message = pegawaiId ? `Data pegawai ${finalData.pegawai_nama} berhasil diperbarui!` : `Data pegawai ${finalData.pegawai_nama} berhasil disimpan!`;
            logActivity(message);
        }

        return { success: true, message: message, pegawai: finalData };

    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = Object.entries(error.flatten().fieldErrors).map(([field, errors]) => `${field}: ${errors.join(', ')}`).join('; ');
        return { success: false, message: `Data tidak valid. Periksa kembali isian Anda. Kesalahan: ${errorMessages}`, errors: error.flatten().fieldErrors };
      }
      console.error('Pegawai submission error:', error);
      return { success: false, message: 'Gagal menyimpan data pegawai.' };
    }
  }

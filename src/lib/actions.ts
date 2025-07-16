
'use server';

import { suggestUploadCategory } from '@/ai/flows/suggest-upload-category';
import { studentFormSchema, completeStudentFormSchema } from '@/lib/schema';
import { pegawaiFormSchema, completePegawaiFormSchema } from '@/lib/pegawai-schema';
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

export async function submitStudentData(data: Partial<Siswa>) {
  try {
    const parsedData = studentFormSchema.parse(data);
    const isUpdate = !!data.id;

    // Check completion status
    const completionResult = completeStudentFormSchema.safeParse(data);
    const status = completionResult.success ? 'Lengkap' : 'Belum Lengkap';
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const id = data.id || crypto.randomUUID();
    const message = isUpdate ? `Data siswa ${data.namaLengkap} berhasil diperbarui!` : `Data siswa ${data.namaLengkap} berhasil disimpan!`;

    logActivity(message);

    return { success: true, message, id };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      return { success: false, message: 'Data tidak valid.', errors: error.errors };
    }
    console.error('Submission error:', error);
    return { success: false, message: 'Gagal menyimpan data siswa.' };
  }
}

export async function submitPegawaiData(data: Partial<Pegawai>) {
    try {
      const parsedData = pegawaiFormSchema.parse(data);
      const isUpdate = !!data.id;
      
      const completionResult = completePegawaiFormSchema.safeParse(data);
      const status = completionResult.success ? 'Lengkap' : 'Belum Lengkap';
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const id = data.id || crypto.randomUUID();
      const message = isUpdate ? `Data pegawai ${data.nama} berhasil diperbarui!` : `Data pegawai ${data.nama} berhasil disimpan!`;

      logActivity(message);
  
      return { success: true, message, id };
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error:', error.errors);
        return { success: false, message: 'Data tidak valid.', errors: error.errors };
      }
      console.error('Submission error:', error);
      return { success: false, message: 'Gagal menyimpan data pegawai.' };
    }
  }


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
    const dataWithDates = {
        ...data,
        tanggalLahir: data.tanggalLahir ? new Date(data.tanggalLahir) : undefined,
        tanggalSttb: data.tanggalSttb ? new Date(data.tanggalSttb) : undefined,
        pindahanDiterimaTanggal: data.pindahanDiterimaTanggal ? new Date(data.pindahanDiterimaTanggal) : undefined,
        keluarTanggal: data.keluarTanggal ? new Date(data.keluarTanggal) : undefined,
    };

    const parsedData = studentFormSchema.parse(dataWithDates);
    const isUpdate = !!data.id;

    const completionResult = completeStudentFormSchema.safeParse(dataWithDates);
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

export async function submitPegawaiData(data: Partial<Pegawai> & {id?: string}) {
    try {
        const dataWithDates = {
            ...data,
            tanggalLahir: data.tanggalLahir ? new Date(data.tanggalLahir) : undefined,
            tanggalPerkawinan: data.tanggalPerkawinan ? new Date(data.tanggalPerkawinan) : undefined,
            terhitungMulaiTanggal: data.terhitungMulaiTanggal ? new Date(data.terhitungMulaiTanggal) : undefined,
        };

      const parsedData = pegawaiFormSchema.parse(dataWithDates);
      const isUpdate = !!data.id;
      
      // In a real app, this would be a database call.
      const allPegawai: Pegawai[] = typeof window !== 'undefined' 
        ? JSON.parse(localStorage.getItem('pegawaiData') || '[]')
        : []; 

      // Check for duplicates only when creating a new pegawai
      if (!isUpdate) {
        if (parsedData.nip && allPegawai.some(p => p.nip === parsedData.nip)) {
            return { success: false, message: 'NIP sudah terdaftar. Harap gunakan NIP yang unik.' };
        }
        if (parsedData.nuptk && allPegawai.some(p => p.nuptk === parsedData.nuptk)) {
            return { success: false, message: 'NUPTK sudah terdaftar. Harap gunakan NUPTK yang unik.' };
        }
      }
      
      const completionResult = completePegawaiFormSchema.safeParse(dataWithDates);
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


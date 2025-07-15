'use server';

import { suggestUploadCategory } from '@/ai/flows/suggest-upload-category';
import { studentFormSchema } from '@/lib/schema';
import { z } from 'zod';

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

export async function submitStudentData(data: unknown) {
  try {
    // We only need to parse with the base schema here for submission validation
    const parsedData = studentFormSchema.parse(data);
    const status = (data as any).status || 'Belum Lengkap';
    
    // In a real application, you would save this to a database.
    // We are simulating this by returning the ID and handling storage on the client.
    console.log('Form data submitted successfully with status:', status);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newId = crypto.randomUUID();

    return { success: true, message: `Data siswa berhasil disimpan dengan status ${status}!`, id: newId };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      return { success: false, message: 'Data tidak valid.', errors: error.errors };
    }
    console.error('Submission error:', error);
    return { success: false, message: 'Gagal menyimpan data siswa.' };
  }
}

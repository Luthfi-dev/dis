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
    const parsedData = studentFormSchema.parse(data);
    // In a real application, you would save the data to a database.
    // The table name would be `siswa_...` as requested.
    // For file uploads, you would handle storing the files in a cloud storage bucket
    // in a folder named 'uploads'.
    console.log('Form data submitted successfully:', JSON.stringify(parsedData, null, 2));

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return { success: true, message: 'Data siswa berhasil disimpan!' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      return { success: false, message: 'Validation failed.', errors: error.errors };
    }
    console.error('Submission error:', error);
    return { success: false, message: 'Gagal menyimpan data siswa.' };
  }
}

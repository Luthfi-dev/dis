'use server';

import { suggestUploadCategory } from '@/ai/flows/suggest-upload-category';
import { studentFormSchema, dataSiswaSchema } from '@/lib/schema';
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
    
    const isComplete = dataSiswaSchema.safeParse(data).success;
    const status = isComplete ? 'Lengkap' : 'Draft';
    
    // In a real application, you would save this to a database.
    // We are simulating this by returning the ID and handling storage on the client.
    console.log('Form data submitted successfully:', JSON.stringify({...parsedData, status}, null, 2));

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newId = crypto.randomUUID();

    return { success: true, message: `Data siswa berhasil disimpan sebagai ${status}!`, id: newId };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      return { success: false, message: 'Validation failed.', errors: error.errors };
    }
    console.error('Submission error:', error);
    return { success: false, message: 'Gagal menyimpan data siswa.' };
  }
}

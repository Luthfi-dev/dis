'use server';

/**
 * @fileOverview AI agent that suggests a category for uploaded documents.
 *
 * - suggestUploadCategory - A function that suggests a category for a document.
 * - SuggestUploadCategoryInput - The input type for the suggestUploadCategory function.
 * - SuggestUploadCategoryOutput - The return type for the suggestUploadCategory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestUploadCategoryInputSchema = z.object({
  documentDescription: z
    .string()
    .describe('The description of the document to categorize.'),
});
export type SuggestUploadCategoryInput = z.infer<typeof SuggestUploadCategoryInputSchema>;

const SuggestUploadCategoryOutputSchema = z.object({
  suggestedCategory: z
    .string()
    .describe(
      'The suggested category for the uploaded document. Example: Ijazah, Transkrip, etc.'
    ),
});
export type SuggestUploadCategoryOutput = z.infer<typeof SuggestUploadCategoryOutputSchema>;

export async function suggestUploadCategory(
  input: SuggestUploadCategoryInput
): Promise<SuggestUploadCategoryOutput> {
  return suggestUploadCategoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestUploadCategoryPrompt',
  input: {schema: SuggestUploadCategoryInputSchema},
  output: {schema: SuggestUploadCategoryOutputSchema},
  prompt: `You are an AI assistant that suggests the most appropriate category for an uploaded document related to student records.

  Given the document description, suggest a category from the following options: Ijazah, Transkrip, Rapor, Akta Kelahiran, Kartu Keluarga, Surat Pindah, Sertifikat Prestasi, Lainnya.

  Description: {{{documentDescription}}}

  Category:`,
});

const suggestUploadCategoryFlow = ai.defineFlow(
  {
    name: 'suggestUploadCategoryFlow',
    inputSchema: SuggestUploadCategoryInputSchema,
    outputSchema: SuggestUploadCategoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

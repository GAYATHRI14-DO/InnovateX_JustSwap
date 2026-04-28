
'use server';
/**
 * @fileOverview An AI agent that helps users generate or refine item descriptions for swap listings.
 *
 * - generateDescription - A function that handles the item description generation process.
 * - GenerateDescriptionInput - The input type for the generateDescription function.
 * - GenerateDescriptionOutput - The return type for the generateDescription function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateDescriptionInputSchema = z.object({
  itemTitle: z.string().describe('The title of the item.'),
  category: z.string().describe('The category the item belongs to (e.g., electronics, clothing, books).'),
  keywords: z.array(z.string()).describe('A list of keywords or key features for the item.'),
});
export type GenerateDescriptionInput = z.infer<typeof GenerateDescriptionInputSchema>;

const GenerateDescriptionOutputSchema = z.object({
  description: z.string().describe('A generated or refined description for the item, suitable for a swap listing.'),
});
export type GenerateDescriptionOutput = z.infer<typeof GenerateDescriptionOutputSchema>;

/**
 * Generates or refines an item description based on the provided title, category, and keywords.
 *
 * @param input - The input containing the item title, category, and keywords.
 * @returns The generated or refined item description.
 */
export async function generateDescription(input: GenerateDescriptionInput): Promise<GenerateDescriptionOutput> {
  return generateDescriptionFlow(input);
}

const generateDescriptionPrompt = ai.definePrompt({
  name: 'generateDescriptionPrompt',
  input: { schema: GenerateDescriptionInputSchema },
  output: { schema: GenerateDescriptionOutputSchema },
  prompt: `You are an AI assistant specialized in creating appealing and informative item descriptions for a swap platform called "Swap".

Generate a detailed and attractive description for an item based on the following information. Highlight its best features, condition, and why someone might want to swap for it. The description should be engaging and concise.

Item Title: {{{itemTitle}}}
Category: {{{category}}}
Keywords: {{#each keywords}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Generated Description:`,
});

const generateDescriptionFlow = ai.defineFlow(
  {
    name: 'generateDescriptionFlow',
    inputSchema: GenerateDescriptionInputSchema,
    outputSchema: GenerateDescriptionOutputSchema,
  },
  async (input) => {
    const { output } = await generateDescriptionPrompt(input);
    return output!;
  }
);

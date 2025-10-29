'use server';

/**
 * @fileOverview A flow that summarizes issue descriptions.
 *
 * - summarizeIssueDescription - A function that summarizes the provided text.
 * - SummarizeIssueDescriptionInput - The input type for the summarizeIssueDescription function.
 * - SummarizeIssueDescriptionOutput - The return type for the summarizeIssueDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeIssueDescriptionInputSchema = z.object({
  issueDescription: z
    .string()
    .describe('The full description of the issue to be summarized.'),
});
export type SummarizeIssueDescriptionInput = z.infer<
  typeof SummarizeIssueDescriptionInputSchema
>;

const SummarizeIssueDescriptionOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the issue description.'),
});
export type SummarizeIssueDescriptionOutput = z.infer<
  typeof SummarizeIssueDescriptionOutputSchema
>;

export async function summarizeIssueDescription(
  input: SummarizeIssueDescriptionInput
): Promise<SummarizeIssueDescriptionOutput> {
  return summarizeIssueDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeIssueDescriptionPrompt',
  input: {schema: SummarizeIssueDescriptionInputSchema},
  output: {schema: SummarizeIssueDescriptionOutputSchema},
  prompt: `Summarize the following issue description in a concise manner:\n\n{{{issueDescription}}}`,
});

const summarizeIssueDescriptionFlow = ai.defineFlow(
  {
    name: 'summarizeIssueDescriptionFlow',
    inputSchema: SummarizeIssueDescriptionInputSchema,
    outputSchema: SummarizeIssueDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

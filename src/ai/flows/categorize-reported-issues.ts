'use server';

/**
 * @fileOverview This file defines a Genkit flow for categorizing reported issues.
 *
 * It includes:
 * - categorizeReportedIssue - A function to categorize a reported issue.
 * - CategorizeReportedIssueInput - The input type for the categorizeReportedIssue function.
 * - CategorizeReportedIssueOutput - The output type for the categorizeReportedIssue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IssueCategorySchema = z.enum([
  'Roads and Highways',
  'Water and Sewage',
  'Waste Management',
  'Parks and Recreation',
  'Public Safety',
  'Other',
]);

const CategorizeReportedIssueInputSchema = z.object({
  issueDescription: z
    .string()
    .describe('The description of the reported issue.'),
});
export type CategorizeReportedIssueInput = z.infer<
  typeof CategorizeReportedIssueInputSchema
>;

const CategorizeReportedIssueOutputSchema = z.object({
  category: IssueCategorySchema.describe(
    'The category the reported issue belongs to.'
  ),
});
export type CategorizeReportedIssueOutput = z.infer<
  typeof CategorizeReportedIssueOutputSchema
>;

export async function categorizeReportedIssue(
  input: CategorizeReportedIssueInput
): Promise<CategorizeReportedIssueOutput> {
  return categorizeReportedIssueFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeReportedIssuePrompt',
  input: {schema: CategorizeReportedIssueInputSchema},
  output: {schema: CategorizeReportedIssueOutputSchema},
  prompt: `You are an expert in classifying reported civic issues into predefined categories.

  Given the following issue description, determine the most appropriate category from the list below:
  - Roads and Highways
  - Water and Sewage
  - Waste Management
  - Parks and Recreation
  - Public Safety
  - Other

  Issue Description: {{{issueDescription}}}

  Respond with only the category name.
  `,
});

const categorizeReportedIssueFlow = ai.defineFlow(
  {
    name: 'categorizeReportedIssueFlow',
    inputSchema: CategorizeReportedIssueInputSchema,
    outputSchema: CategorizeReportedIssueOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

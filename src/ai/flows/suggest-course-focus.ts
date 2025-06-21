'use server';

/**
 * @fileOverview Analyzes past grades and suggests courses for improvement.
 *
 * - suggestCourseFocus - A function that provides course focus suggestions.
 * - SuggestCourseFocusInput - The input type for the suggestCourseFocus function.
 * - SuggestCourseFocusOutput - The return type for the suggestCourseFocus function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCourseFocusInputSchema = z.object({
  grades: z
    .record(z.number())
    .describe(
      'A record of course names and grades, where the key is the course name and the value is the grade (0-100).' 
    ),
});
export type SuggestCourseFocusInput = z.infer<typeof SuggestCourseFocusInputSchema>;

const SuggestCourseFocusOutputSchema = z.object({
  suggestion: z
    .string()
    .describe(
      'A textual suggestion for a course the student may want to focus on, including specific areas for improvement.'
    ),
});
export type SuggestCourseFocusOutput = z.infer<typeof SuggestCourseFocusOutputSchema>;

export async function suggestCourseFocus(input: SuggestCourseFocusInput): Promise<SuggestCourseFocusOutput> {
  return suggestCourseFocusFlow(input);
}

const analyzeGradesTool = ai.defineTool({
  name: 'analyzeGrades',
  description: 'Analyzes a student\'s grades and identifies courses where they can improve.',
  inputSchema: z.object({
    grades: z
      .record(z.number())
      .describe(
        'A record of course names and grades, where the key is the course name and the value is the grade (0-100).'
      ),
  }),
  outputSchema: z.string(),
}, async (input) => {
  // Basic analysis: find the course with the lowest grade.
  let lowestGradeCourse = '';
  let lowestGrade = 100;
  for (const course in input.grades) {
    if (input.grades[course] < lowestGrade) {
      lowestGrade = input.grades[course];
      lowestGradeCourse = course;
    }
  }

  if (lowestGradeCourse) {
    return `Based on the provided grades, the course with the lowest grade is ${lowestGradeCourse} with a grade of ${lowestGrade}.`;
  } else {
    return 'No courses found.';
  }
});

const prompt = ai.definePrompt({
  name: 'suggestCourseFocusPrompt',
  tools: [analyzeGradesTool],
  input: {schema: SuggestCourseFocusInputSchema},
  output: {schema: SuggestCourseFocusOutputSchema},
  prompt: `You are an academic advisor. A student has provided their grades. 

  Use the analyzeGrades tool to analyze the student's grades and provide a suggestion on which course they should focus on to improve their GPA.  

  Grades: {{{grades}}}

  Based on your analysis, what course should the student focus on, and what specific areas should they improve in?
  `,
});

const suggestCourseFocusFlow = ai.defineFlow(
  {
    name: 'suggestCourseFocusFlow',
    inputSchema: SuggestCourseFocusInputSchema,
    outputSchema: SuggestCourseFocusOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

import type { Course } from '@/types';

export const GRADE_OPTIONS = [
  { value: 'S', points: 10.0 },
  { value: 'A', points: 9.0 },
  { value: 'B', points: 8.0 },
  { value: 'C', points: 7.0 },
  { value: 'D', points: 6.0 },
  { value: 'E', points: 5.0 },
  { value: 'F', points: 0.0 },
  { value: 'Z', points: 0.0 },
  { value: 'P', points: 0.0 }, // 'P' grade has 0 points and is excluded from GPA calculation
];

/**
 * Converts a letter grade into its corresponding grade points.
 * @param grade The letter grade (e.g., 'A', 'B', 'F').
 * @returns The numeric point value for the grade.
 */
export function gradeToPoints(grade: string): number {
  const foundGrade = GRADE_OPTIONS.find(g => g.value === grade);
  return foundGrade ? foundGrade.points : 0;
}

/**
 * Calculates the Grade Point Average (GPA) for a list of courses.
 * This function correctly handles the university's specific rules:
 * - Excludes 0-credit courses.
 * - Excludes 'P' (Pass) grade courses.
 * - Includes credits for 'F' (Fail) and 'Z' (Incomplete) grades in the denominator.
 * @param courses An array of Course objects.
 * @returns The calculated GPA.
 */
export function calculateGPA(courses: Course[]): number {
  let totalWeightedPoints = 0; // This will be the numerator: Σ(Credits × Grade Point)
  let totalCreditsForGpa = 0;   // This will be the denominator: Σ(Credits)

  for (const course of courses) {
    const credits = Number(course.credits) || 0;
    const grade = course.grade;

    // Rule: Exclude zero-credit courses and 'P' grade courses from the calculation entirely.
    if (credits === 0 || grade === 'P') {
      continue; // Skip this course, it doesn't affect GPA
    }

    // For all other courses, their credits are added to the GPA denominator.
    // This correctly includes courses failed with 'F' or 'Z' grades.
    totalCreditsForGpa += credits;

    // Calculate the points for this course (e.g., 'A' -> 9.0)
    const points = gradeToPoints(grade);
    
    // Add the weighted points (credits * points) to the GPA numerator.
    // For 'F' and 'Z' grades, `points` will be 0, so 0 is added.
    totalWeightedPoints += points * credits;
  }

  // Avoid division by zero if there are no courses that count towards GPA.
  if (totalCreditsForGpa === 0) {
    return 0;
  }

  // Calculate the final GPA.
  const gpa = totalWeightedPoints / totalCreditsForGpa;
  
  // Return the calculated GPA, or 0 if the result is not a number (which shouldn't happen here).
  return Number.isNaN(gpa) ? 0 : gpa;
}

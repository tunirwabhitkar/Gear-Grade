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
  // Filter courses that count towards GPA according to the rules.
  // A course counts if it has more than 0 credits and the grade is not 'P' (Pass).
  // This correctly includes courses with 'F' and 'Z' grades.
  const gpaCourses = courses.filter(course => {
    const credits = Number(course.credits) || 0;
    return credits > 0 && course.grade !== 'P';
  });

  // If there are no courses that count towards GPA, return 0.
  if (gpaCourses.length === 0) {
    return 0;
  }

  // Calculate the total credits for the denominator.
  // This sums the credits of all courses that passed the filter.
  const totalCreditsForGpa = gpaCourses.reduce((acc, course) => {
    return acc + (Number(course.credits) || 0);
  }, 0);

  // Calculate the total weighted points for the numerator.
  // This sums the product of (credits * grade points) for each course.
  const totalWeightedPoints = gpaCourses.reduce((acc, course) => {
    const credits = Number(course.credits) || 0;
    const points = gradeToPoints(course.grade);
    return acc + (points * credits);
  }, 0);

  // Avoid division by zero.
  if (totalCreditsForGpa === 0) {
    return 0;
  }

  // Calculate the final GPA.
  const gpa = totalWeightedPoints / totalCreditsForGpa;
  
  // Return the calculated GPA, or 0 if the result is NaN.
  return Number.isNaN(gpa) ? 0 : gpa;
}

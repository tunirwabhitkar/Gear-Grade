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
  { value: 'P', points: 0.0 },
];

export function gradeToPoints(grade: string): number {
  const foundGrade = GRADE_OPTIONS.find(g => g.value === grade);
  return foundGrade ? foundGrade.points : 0;
}

export function calculateGPA(courses: Course[]): number {
  let totalPoints = 0;
  let totalCreditsAttempted = 0;

  for (const course of courses) {
    const credits = Number(course.credits) || 0;
    const grade = course.grade;

    // Rule: Exclude non-credit-bearing courses (0 credits) and 'P' (Pass) grades from GPA calculations.
    // These courses do not contribute to the numerator or the denominator.
    if (credits === 0 || grade === 'P') {
      continue;
    }

    // For all other courses (including those with 'F' or 'Z' grades), add credits to the denominator.
    totalCreditsAttempted += credits;

    // Add the weighted grade points to the numerator.
    // gradeToPoints returns 0 for 'F' and 'Z', so failed courses add 0 to the total points.
    totalPoints += gradeToPoints(grade) * credits;
  }

  if (totalCreditsAttempted === 0) {
    return 0;
  }

  const gpa = totalPoints / totalCreditsAttempted;
  
  // Return the calculated GPA, or 0 if the result is not a number.
  return Number.isNaN(gpa) ? 0 : gpa;
}
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
  // Filter for courses to be included in GPA/CGPA calculation.
  // This excludes non-credit bearing courses (credits === 0) and 'P' (Pass/Fail) grades.
  const relevantCourses = courses.filter(course => {
    const credits = Number(course.credits) || 0;
    return credits > 0 && course.grade !== 'P';
  });

  if (relevantCourses.length === 0) {
    return 0;
  }

  // Numerator: Sum of (Grade Point * Credits).
  // For 'F' and 'Z' grades, gradeToPoints returns 0, correctly adding 0 to the sum.
  const totalPoints = relevantCourses.reduce((acc, course) => {
    const credits = Number(course.credits) || 0;
    return acc + gradeToPoints(course.grade) * credits;
  }, 0);

  // Denominator: Sum of credits for all relevant courses, including failed ones ('F', 'Z').
  const totalCredits = relevantCourses.reduce((acc, course) => {
    const credits = Number(course.credits) || 0;
    return acc + credits;
  }, 0);

  if (totalCredits === 0) {
    return 0;
  }

  const gpa = totalPoints / totalCredits;
  return Number.isNaN(gpa) ? 0 : gpa;
}

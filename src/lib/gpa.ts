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
  let totalCredits = 0;

  courses.forEach(course => {
    const credits = Number(course.credits) || 0;
    if (credits > 0) {
      totalPoints += gradeToPoints(course.grade) * credits;
      totalCredits += credits;
    }
  });

  if (totalCredits === 0) {
    return 0;
  }

  const gpa = totalPoints / totalCredits;
  return Number.isNaN(gpa) ? 0 : gpa;
}

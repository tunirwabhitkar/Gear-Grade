import type { Course } from '@/types';

export const GRADE_OPTIONS = [
  { value: 'A', points: 4.0, numeric: 95 },
  { value: 'A-', points: 3.7, numeric: 92 },
  { value: 'B+', points: 3.3, numeric: 88 },
  { value: 'B', points: 3.0, numeric: 85 },
  { value: 'B-', points: 2.7, numeric: 82 },
  { value: 'C+', points: 2.3, numeric: 78 },
  { value: 'C', points: 2.0, numeric: 75 },
  { value: 'C-', points: 1.7, numeric: 72 },
  { value: 'D+', points: 1.3, numeric: 68 },
  { value: 'D', points: 1.0, numeric: 65 },
  { value: 'F', points: 0.0, numeric: 50 },
];

export function gradeToPoints(grade: string): number {
  const foundGrade = GRADE_OPTIONS.find(g => g.value === grade);
  return foundGrade ? foundGrade.points : 0;
}

export function gradeToNumeric(grade: string): number {
  const foundGrade = GRADE_OPTIONS.find(g => g.value === grade);
  return foundGrade ? foundGrade.numeric : 0;
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

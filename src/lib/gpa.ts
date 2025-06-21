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
  // Filter for courses that should be included in GPA calculation.
  // This excludes courses with 0 credits, Pass/Fail courses ('P'), and failed courses ('F', 'Z').
  const gpaCourses = courses.filter(course => {
    const credits = Number(course.credits) || 0;
    return credits > 0 && course.grade !== 'P' && course.grade !== 'F' && course.grade !== 'Z';
  });

  if (gpaCourses.length === 0) {
    return 0;
  }

  const totalPoints = gpaCourses.reduce((acc, course) => {
    const credits = Number(course.credits) || 0;
    return acc + gradeToPoints(course.grade) * credits;
  }, 0);

  const totalCredits = gpaCourses.reduce((acc, course) => {
    const credits = Number(course.credits) || 0;
    return acc + credits;
  }, 0);

  if (totalCredits === 0) {
    return 0;
  }

  const gpa = totalPoints / totalCredits;
  return Number.isNaN(gpa) ? 0 : gpa;
}

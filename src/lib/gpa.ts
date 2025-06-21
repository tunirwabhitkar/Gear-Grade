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

const gradePoints: { [key: string]: number } = {
  "S": 10,
  "A": 9,
  "B": 8,
  "C": 7,
  "D": 6,
  "E": 5,
  "F": 0,
  "Z": 0
};


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
 * @param courses An array of Course objects.
 * @returns The calculated GPA.
 */
export function calculateGPA(courses: Course[]): number {
  let totalCredits = 0;
  let weightedSum = 0;

  courses.forEach(course => {
    const credit = Number(course.credits);
    const grade = course.grade?.toUpperCase();

    // Only include subjects with credit > 0 and a grade that has points
    if (!isNaN(credit) && credit > 0 && gradePoints.hasOwnProperty(grade)) {
      const gp = gradePoints[grade];
      totalCredits += credit;
      weightedSum += credit * gp;
    }
  });

  if (totalCredits === 0) {
    return 0.0;
  }

  const gpa = weightedSum / totalCredits;
  return Number.isNaN(gpa) ? 0 : gpa;
}
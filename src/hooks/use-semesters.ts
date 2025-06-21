'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Semester, Course } from '@/types';
import { calculateGPA } from '@/lib/gpa';

const INITIAL_SEMESTER: Semester = {
  id: `semester-${Date.now()}`,
  name: 'Semester 1',
  courses: [
    { id: `course-${Date.now()}-1`, name: 'Example Course 1', credits: 3, grade: 'A' },
    { id: `course-${Date.now()}-2`, name: 'Example Course 2', credits: 4, grade: 'B' },
  ],
};

export function useSemesters() {
  const [semesters, setSemesters] = useState<Semester[]>([]);

  useEffect(() => {
    try {
      const savedSemesters = localStorage.getItem('gearGradeSemesters');
      if (savedSemesters) {
        setSemesters(JSON.parse(savedSemesters));
      } else {
        setSemesters([INITIAL_SEMESTER]);
      }
    } catch (error) {
      console.error("Could not load semesters from localStorage", error);
      setSemesters([INITIAL_SEMESTER]);
    }
  }, []);

  useEffect(() => {
    try {
        localStorage.setItem('gearGradeSemesters', JSON.stringify(semesters));
    } catch (error) {
        console.error("Could not save semesters to localStorage", error);
    }
  }, [semesters]);

  const addSemester = useCallback(() => {
    setSemesters(prev => [
      ...prev,
      {
        id: `semester-${Date.now()}`,
        name: `Semester ${prev.length + 1}`,
        courses: [],
      },
    ]);
  }, []);

  const updateSemester = useCallback((semesterId: string, name: string) => {
    setSemesters(prev =>
      prev.map(s => (s.id === semesterId ? { ...s, name } : s))
    );
  }, []);

  const deleteSemester = useCallback((semesterId: string) => {
    setSemesters(prev => prev.filter(s => s.id !== semesterId));
  }, []);

  const addCourse = useCallback((semesterId: string) => {
    setSemesters(prev =>
      prev.map(s =>
        s.id === semesterId
          ? {
              ...s,
              courses: [
                ...s.courses,
                { id: `course-${Date.now()}`, name: '', credits: 3, grade: 'A' },
              ],
            }
          : s
      )
    );
  }, []);

  const updateCourse = useCallback((semesterId: string, courseId: string, updatedCourse: Partial<Course>) => {
    setSemesters(prev =>
      prev.map(s =>
        s.id === semesterId
          ? {
              ...s,
              courses: s.courses.map(c =>
                c.id === courseId ? { ...c, ...updatedCourse } : c
              ),
            }
          : s
      )
    );
  }, []);

  const deleteCourse = useCallback((semesterId: string, courseId: string) => {
    setSemesters(prev =>
      prev.map(s =>
        s.id === semesterId
          ? { ...s, courses: s.courses.filter(c => c.id !== courseId) }
          : s
      )
    );
  }, []);

  const resetSemesters = useCallback(() => {
    setSemesters([
      {
        id: `semester-${Date.now()}`,
        name: 'Semester 1',
        courses: [],
      },
    ]);
  }, []);

  const allCourses = semesters.flatMap(s => s.courses);
  const cgpa = calculateGPA(allCourses);
  const totalCredits = allCourses.reduce((acc, course) => acc + (Number(course.credits) || 0), 0);

  return {
    semesters,
    cgpa,
    totalCredits,
    addSemester,
    updateSemester,
    deleteSemester,
    addCourse,
    updateCourse,
    deleteCourse,
    resetSemesters,
  };
}

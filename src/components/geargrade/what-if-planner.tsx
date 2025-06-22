'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Semester, Course } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, ArrowRight } from 'lucide-react';
import { calculateGPA } from '@/lib/gpa';
import SemesterCard from './semester-card';
import CgpaGauge from './cgpa-gauge';

interface WhatIfPlannerProps {
  baseSemesters: Semester[];
  baseCgpa: number;
}

export default function WhatIfPlanner({ baseSemesters, baseCgpa }: WhatIfPlannerProps) {
  const [hypotheticalSemesters, setHypotheticalSemesters] = useState<Semester[]>([]);

  const addHypotheticalSemester = useCallback(() => {
    setHypotheticalSemesters(prev => [
      ...prev,
      {
        id: `what-if-sem-${Date.now()}`,
        name: `Future Semester ${prev.length + 1}`,
        courses: [{ id: `what-if-course-${Date.now()}`, name: '', credits: 3, grade: 'S' }],
      },
    ]);
  }, []);
  
  const updateHypotheticalSemester = useCallback((semesterId: string, name: string) => {
    setHypotheticalSemesters(prev =>
      prev.map(s => (s.id === semesterId ? { ...s, name } : s))
    );
  }, []);

  const deleteHypotheticalSemester = useCallback((semesterId: string) => {
    setHypotheticalSemesters(prev => prev.filter(s => s.id !== semesterId));
  }, []);

  const addHypotheticalCourse = useCallback((semesterId: string) => {
    setHypotheticalSemesters(prev =>
      prev.map(s =>
        s.id === semesterId
          ? {
              ...s,
              courses: [
                ...s.courses,
                { id: `what-if-course-${Date.now()}`, name: '', credits: 3, grade: 'A' },
              ],
            }
          : s
      )
    );
  }, []);

  const updateHypotheticalCourse = useCallback((semesterId: string, courseId: string, updatedCourse: Partial<Course>) => {
    setHypotheticalSemesters(prev =>
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

  const deleteHypotheticalCourse = useCallback((semesterId: string, courseId: string) => {
    setHypotheticalSemesters(prev =>
      prev.map(s =>
        s.id === semesterId
          ? { ...s, courses: s.courses.filter(c => c.id !== courseId) }
          : s
      )
    );
  }, []);

  const projectedCgpa = useMemo(() => {
    if (hypotheticalSemesters.length === 0) {
      return baseCgpa;
    }
    const allCourses = [
      ...baseSemesters.flatMap(s => s.courses),
      ...hypotheticalSemesters.flatMap(s => s.courses),
    ];
    return calculateGPA(allCourses);
  }, [baseSemesters, hypotheticalSemesters, baseCgpa]);

  const handleReset = () => {
    setHypotheticalSemesters([]);
  }

  return (
    <>
      <div className="p-6">
        <div className="flex justify-around items-center">
            <CgpaGauge gpa={baseCgpa} label="Current CGPA"/>
            <ArrowRight className="h-8 w-8 text-muted-foreground shrink-0" />
            <CgpaGauge gpa={projectedCgpa} label="Projected CGPA"/>
        </div>
      </div>
      <Separator />
      <ScrollArea className="flex-grow">
        <div className="p-6 space-y-4">
          {hypotheticalSemesters.map((semester, index) => (
            <SemesterCard
              key={semester.id}
              semester={semester}
              semesterIndex={index}
              updateSemester={updateHypotheticalSemester}
              deleteSemester={deleteHypotheticalSemester}
              addCourse={addHypotheticalCourse}
              updateCourse={updateHypotheticalCourse}
              deleteCourse={deleteHypotheticalCourse}
              isOnlySemester={hypotheticalSemesters.length === 1}
            />
          ))}
           {hypotheticalSemesters.length === 0 && (
            <div className="text-center py-10 border-2 border-dashed rounded-lg">
                <p className="text-sm text-muted-foreground px-4">Add a future semester to see how it affects your CGPA.</p>
            </div>
           )}
        </div>
      </ScrollArea>
      <Separator />
      <div className="p-4 flex justify-between items-center bg-background/95">
        <Button onClick={addHypotheticalSemester}>
          <Plus className="mr-2 h-4 w-4" /> Add Future Semester
        </Button>
        {hypotheticalSemesters.length > 0 && (
            <Button variant="ghost" className="text-destructive hover:text-destructive" onClick={handleReset}>
                <Trash2 className="mr-2 h-4 w-4"/>
                Reset Planner
            </Button>
        )}
      </div>
    </>
  );
}
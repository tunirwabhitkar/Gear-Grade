'use client';
import { useMemo } from 'react';
import type { Semester, Course } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import CourseRow from './course-row';
import { calculateGPA } from '@/lib/gpa';
import CgpaGauge from './cgpa-gauge';
import { Input } from '../ui/input';

interface SemesterCardProps {
  semester: Semester;
  semesterIndex: number;
  updateSemester: (id: string, name: string) => void;
  deleteSemester: (id: string) => void;
  addCourse: (semesterId: string) => void;
  updateCourse: (semesterId: string, courseId: string, updatedCourse: Partial<Course>) => void;
  deleteCourse: (semesterId: string, courseId: string) => void;
  isOnlySemester: boolean;
}

export default function SemesterCard({
  semester,
  semesterIndex,
  updateSemester,
  deleteSemester,
  addCourse,
  updateCourse,
  deleteCourse,
  isOnlySemester,
}: SemesterCardProps) {
  const semesterGpa = useMemo(() => calculateGPA(semester.courses), [semester.courses]);
  const semesterCredits = useMemo(() => 
    semester.courses
      .filter(course => course.grade !== 'F' && course.grade !== 'Z')
      .reduce((acc, course) => acc + (Number(course.credits) || 0), 0)
  , [semester.courses]);


  return (
    <Card className="flex flex-col print-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/50">
        <div className="flex items-center gap-2">
           <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
            <Input
              value={semester.name}
              onChange={(e) => updateSemester(semester.id, e.target.value)}
              className="h-8 text-lg font-semibold border-none focus-visible:ring-0 shadow-none bg-transparent"
            />
        </div>
        <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="font-bold text-base">{semesterCredits.toFixed(1)} Credits</p>
              <p className="text-xs text-muted-foreground">Credits Earned</p>
            </div>
            <CgpaGauge gpa={semesterGpa} label="SGPA"/>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-grow">
        <div className="divide-y">
          {semester.courses.map((course) => (
            <CourseRow
              key={course.id}
              course={course}
              onUpdateCourse={updateCourse}
              onDeleteCourse={deleteCourse}
              semesterId={semester.id}
              isOnlyCourse={semester.courses.length === 1}
            />
          ))}
          {semester.courses.length === 0 && (
            <p className="text-muted-foreground text-center p-8">No courses added yet.</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-2 bg-muted/50 flex justify-between">
        <Button variant="ghost" onClick={() => addCourse(semester.id)}>
          <Plus className="mr-2 h-4 w-4" /> Add Course
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteSemester(semester.id)}
          disabled={isOnlySemester}
          title={isOnlySemester ? "Cannot delete the only semester" : "Delete semester"}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </CardFooter>
    </Card>
  );
}

'use client';
import { useState, useMemo } from 'react';
import type { Semester, Course } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import CourseRow from './course-row';
import { calculateGPA } from '@/lib/gpa';
import CgpaGauge from './cgpa-gauge';

interface SemesterCardProps {
  semester: Semester;
  semesterIndex: number;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onAddCourse: (semesterId: string) => void;
  onUpdateCourse: (semesterId: string, courseId: string, updatedCourse: Partial<Course>) => void;
  onDeleteCourse: (semesterId: string, courseId: string) => void;
  isOnlySemester: boolean;
}

export default function SemesterCard({
  semester,
  semesterIndex,
  onUpdate,
  onDelete,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
  isOnlySemester,
}: SemesterCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(semester.name);

  const semesterGpa = useMemo(() => calculateGPA(semester.courses), [semester.courses]);
  const semesterCredits = useMemo(() => semester.courses.reduce((acc, course) => acc + (Number(course.credits) || 0), 0), [semester.courses]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleNameBlur = () => {
    if (name.trim() === '') {
      setName(semester.name);
    } else {
      onUpdate(semester.id, name);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNameBlur();
    }
    if (e.key === 'Escape') {
      setName(semester.name);
      setIsEditing(false);
    }
  };

  return (
    <Card className="flex flex-col print-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/50">
        <div className="flex items-center gap-2">
           <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
           {isEditing ? (
            <Input
              value={name}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              onKeyDown={handleKeyDown}
              autoFocus
              className="h-8 text-lg font-semibold"
            />
           ) : (
            <CardTitle onClick={() => setIsEditing(true)} className="cursor-pointer hover:text-primary transition-colors">
                {semester.name}
            </CardTitle>
           )}
        </div>
        <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="font-bold text-base">{semesterCredits} Credits</p>
              <p className="text-xs text-muted-foreground">This Semester</p>
            </div>
            <CgpaGauge gpa={semesterGpa}/>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-grow">
        <div className="divide-y">
          {semester.courses.map((course, index) => (
            <CourseRow
              key={course.id}
              course={course}
              onUpdate={(updatedCourse) => onUpdateCourse(semester.id, course.id, updatedCourse)}
              onDelete={() => onDeleteCourse(semester.id, course.id)}
              isOnlyCourse={semester.courses.length === 1}
            />
          ))}
          {semester.courses.length === 0 && (
            <p className="text-muted-foreground text-center p-8">No courses added yet.</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-2 bg-muted/50 flex justify-between">
        <Button variant="ghost" onClick={() => onAddCourse(semester.id)}>
          <Plus className="mr-2 h-4 w-4" /> Add Course
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(semester.id)}
          disabled={isOnlySemester}
          title={isOnlySemester ? "Cannot delete the only semester" : "Delete semester"}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </CardFooter>
    </Card>
  );
}

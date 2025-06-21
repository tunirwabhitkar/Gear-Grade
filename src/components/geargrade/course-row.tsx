'use client';
import { useEffect, useCallback } from 'react';
import type { Course } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import { GRADE_OPTIONS } from '@/lib/gpa';
import { subjectCredits } from '@/lib/subjects';

interface CourseRowProps {
  course: Course;
  onUpdateCourse: (
    semesterId: string,
    courseId: string,
    updatedCourse: Partial<Course>
  ) => void;
  onDeleteCourse: (semesterId: string, courseId: string) => void;
  semesterId: string;
  isOnlyCourse: boolean;
}

const MANDATORY_GRADE_OPTIONS = [{ value: 'P' }, { value: 'F' }];

export default function CourseRow({
  course,
  onUpdateCourse,
  onDeleteCourse,
  semesterId,
  isOnlyCourse,
}: CourseRowProps) {
  const onUpdate = useCallback(
    (updatedCourse: Partial<Course>) => {
      onUpdateCourse(semesterId, course.id, updatedCourse);
    },
    [onUpdateCourse, semesterId, course.id]
  );

  const onDelete = useCallback(() => {
    onDeleteCourse(semesterId, course.id);
  }, [onDeleteCourse, semesterId, course.id]);

  const upperCaseName = course.name.trim().toUpperCase();
  const creditsForCourse = subjectCredits[upperCaseName];
  const isCreditLocked = creditsForCourse !== undefined;
  const isMandatory = isCreditLocked && creditsForCourse === 0;

  useEffect(() => {
    const updates: Partial<Course> = {};
    let needsUpdate = false;

    if (isCreditLocked && course.credits !== creditsForCourse) {
      updates.credits = creditsForCourse;
      needsUpdate = true;
    }

    if (isMandatory) {
      if (course.grade !== 'P' && course.grade !== 'F') {
        updates.grade = 'P';
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      onUpdate(updates);
    }
  }, [
    course.name,
    course.credits,
    course.grade,
    isCreditLocked,
    isMandatory,
    creditsForCourse,
    onUpdate,
  ]);

  const regularGradeOptions = GRADE_OPTIONS.filter((g) => g.value !== 'P');
  const currentGradeOptions = isMandatory
    ? MANDATORY_GRADE_OPTIONS
    : regularGradeOptions;

  return (
    <div className="flex items-center gap-2 p-2 hover:bg-muted/50 transition-colors">
      <Input
        placeholder="Course Name or Code (e.g. MA201)"
        value={course.name}
        onChange={(e) => onUpdate({ name: e.target.value })}
        className="flex-grow"
      />
      <Input
        type="number"
        min="0"
        placeholder="Credits"
        value={isCreditLocked ? creditsForCourse : course.credits}
        onChange={(e) =>
          !isCreditLocked && onUpdate({ credits: e.target.valueAsNumber })
        }
        className="w-24"
        disabled={isCreditLocked}
        title={
          isCreditLocked
            ? 'Credits are automatically set for this course code.'
            : 'Enter course credits'
        }
      />
      <Select
        value={course.grade}
        onValueChange={(value) => onUpdate({ grade: value })}
      >
        <SelectTrigger className="w-28">
          <SelectValue placeholder="Grade" />
        </SelectTrigger>
        <SelectContent>
          {currentGradeOptions.map((g) => (
            <SelectItem key={g.value} value={g.value}>
              {g.value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        disabled={isOnlyCourse}
        title={isOnlyCourse ? 'Cannot delete the only course' : 'Delete course'}
      >
        <Trash2 className="h-4 w-4 text-destructive/70 hover:text-destructive" />
      </Button>
    </div>
  );
}

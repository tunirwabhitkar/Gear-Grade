'use client';
import { useState, useEffect } from 'react';
import type { Course } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import { GRADE_OPTIONS } from '@/lib/gpa';
import { subjectCredits } from '@/lib/subjects';

interface CourseRowProps {
  course: Course;
  onUpdate: (updatedCourse: Partial<Course>) => void;
  onDelete: () => void;
  isOnlyCourse: boolean;
}

const MANDATORY_GRADE_OPTIONS = [
  { value: 'P' },
  { value: 'F' },
];

export default function CourseRow({ course, onUpdate, onDelete, isOnlyCourse }: CourseRowProps) {
  const [isCreditLocked, setIsCreditLocked] = useState(false);
  const [isMandatory, setIsMandatory] = useState(false);

  useEffect(() => {
    const upperCaseName = course.name.trim().toUpperCase();
    const credits = subjectCredits[upperCaseName];
    const creditIsDefined = credits !== undefined;
    
    setIsCreditLocked(creditIsDefined);
    const isNowMandatory = creditIsDefined && credits === 0;
    setIsMandatory(isNowMandatory);

    if (isNowMandatory) {
      if (course.grade !== 'P' && course.grade !== 'F') {
        onUpdate({ grade: 'P' });
      }
    }

  }, [course.name, course.grade, onUpdate]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    const upperCaseName = newName.trim().toUpperCase();
    const credits = subjectCredits[upperCaseName];

    if (credits !== undefined) {
      onUpdate({ name: newName, credits: credits });
    } else {
      onUpdate({ name: newName });
    }
  };
  
  const regularGradeOptions = GRADE_OPTIONS.filter(g => g.value !== 'P');
  const currentGradeOptions = isMandatory ? MANDATORY_GRADE_OPTIONS : regularGradeOptions;
  
  return (
    <div className="flex items-center gap-2 p-2 hover:bg-muted/50 transition-colors">
      <Input
        placeholder="Course Name or Code (e.g. MA201)"
        value={course.name}
        onChange={handleNameChange}
        className="flex-grow"
      />
      <Input
        type="number"
        min="0"
        placeholder="Credits"
        value={course.credits}
        onChange={(e) => onUpdate({ credits: e.target.valueAsNumber })}
        className="w-24"
        disabled={isCreditLocked}
        title={isCreditLocked ? "Credits are automatically set for this course code." : "Enter course credits"}
      />
      <Select value={course.grade} onValueChange={(value) => onUpdate({ grade: value })}>
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
        title={isOnlyCourse ? "Cannot delete the only course" : "Delete course"}
      >
        <Trash2 className="h-4 w-4 text-destructive/70 hover:text-destructive" />
      </Button>
    </div>
  );
}

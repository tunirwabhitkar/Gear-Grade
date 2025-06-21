'use client';
import type { Course } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import { GRADE_OPTIONS } from '@/lib/gpa';

interface CourseRowProps {
  course: Course;
  onUpdate: (updatedCourse: Partial<Course>) => void;
  onDelete: () => void;
  isOnlyCourse: boolean;
}

export default function CourseRow({ course, onUpdate, onDelete, isOnlyCourse }: CourseRowProps) {
  return (
    <div className="flex items-center gap-2 p-2 hover:bg-muted/50 transition-colors">
      <Input
        placeholder="Course Name (e.g. MATH 101)"
        value={course.name}
        onChange={(e) => onUpdate({ name: e.target.value })}
        className="flex-grow"
      />
      <Input
        type="number"
        min="0"
        placeholder="Credits"
        value={course.credits}
        onChange={(e) => onUpdate({ credits: e.target.valueAsNumber })}
        className="w-24"
      />
      <Select value={course.grade} onValueChange={(value) => onUpdate({ grade: value })}>
        <SelectTrigger className="w-28">
          <SelectValue placeholder="Grade" />
        </SelectTrigger>
        <SelectContent>
          {GRADE_OPTIONS.map((g) => (
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

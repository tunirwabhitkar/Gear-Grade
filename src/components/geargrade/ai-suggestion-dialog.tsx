'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Wand2, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { suggestCourseFocus, SuggestCourseFocusInput } from '@/ai/flows/suggest-course-focus';
import { Semester } from '@/types';
import { gradeToNumeric } from '@/lib/gpa';

interface AiSuggestionDialogProps {
  semesters: Semester[];
}

export default function AiSuggestionDialog({ semesters }: AiSuggestionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGetSuggestion = async () => {
    setIsLoading(true);
    setSuggestion(null);
    setError(null);

    const allCourses = semesters.flatMap(s => s.courses);
    if (allCourses.length === 0) {
      setError("No courses found. Please add some courses and grades first.");
      setIsLoading(false);
      return;
    }

    const grades: Record<string, number> = {};
    allCourses.forEach(course => {
      if (course.name) {
        grades[course.name] = gradeToNumeric(course.grade);
      }
    });

    if (Object.keys(grades).length === 0) {
      setError("Please enter course names to get a suggestion.");
      setIsLoading(false);
      return;
    }

    try {
      const input: SuggestCourseFocusInput = { grades };
      const result = await suggestCourseFocus(input);
      setSuggestion(result.suggestion);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to get suggestion: ${errorMessage}`);
      toast({
        variant: "destructive",
        title: "AI Suggestion Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSuggestion(null);
      setError(null);
    }
  };
  
  const hasCourses = semesters.some(s => s.courses.length > 0);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={!hasCourses} title={!hasCourses ? "Add courses to get a suggestion" : "Get AI Suggestion"}>
          <Wand2 className="mr-2 h-4 w-4" /> AI Suggestion
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Academic Advisor</DialogTitle>
          <DialogDescription>
            Get a personalized suggestion on where to focus your efforts.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
              <Loader2 className="h-10 w-10 animate-spin" />
              <p>Analyzing your grades...</p>
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center justify-center gap-4 text-destructive">
              <AlertTriangle className="h-10 w-10" />
              <p className="text-center">{error}</p>
            </div>
          )}
          {suggestion && (
            <div className="p-4 bg-muted rounded-lg text-sm">
              <p>{suggestion}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          {!suggestion && !error && (
            <Button onClick={handleGetSuggestion} disabled={isLoading} className="w-full">
              {isLoading ? 'Analyzing...' : 'Get Suggestion'}
            </Button>
          )}
          {(suggestion || error) && (
            <Button onClick={() => setIsOpen(false)} className="w-full">
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useSemesters } from '@/hooks/use-semesters';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { FileDown, Plus, RotateCcw, Cog } from 'lucide-react';
import LoadingScreen from '@/components/geargrade/loading-screen';
import AppHeader from '@/components/geargrade/header';
import SemesterCard from '@/components/geargrade/semester-card';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const {
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
  } = useSemesters();
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader cgpa={cgpa} totalCredits={totalCredits} />

      <main className="flex-grow container mx-auto p-4 md:p-6 print-container">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 no-print">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Semesters</h1>
          <div className="flex gap-2 flex-wrap justify-center">
            <Button onClick={addSemester}>
              <Plus className="mr-2 h-4 w-4" /> Add Semester
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <FileDown className="mr-2 h-4 w-4" /> Export
            </Button>
             <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your semesters and course data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={resetSemesters}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {semesters.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <Cog className="mx-auto h-12 w-12 text-muted-foreground animate-spin-slow" />
            <h3 className="mt-4 text-lg font-medium">No Semesters Yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Click &quot;Add Semester&quot; to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {semesters.map((semester, index) => (
              <SemesterCard
                key={semester.id}
                semester={semester}
                semesterIndex={index}
                onUpdate={updateSemester}
                onDelete={deleteSemester}
                onAddCourse={addCourse}
                onUpdateCourse={updateCourse}
                onDeleteCourse={deleteCourse}
                isOnlySemester={semesters.length === 1}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="text-center p-4 text-muted-foreground text-sm no-print">
        <p>GearGrade &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

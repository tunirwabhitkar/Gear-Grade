'use client';

import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FileDown, Plus, RotateCcw, Cog, ChevronDown, FileText, FileSpreadsheet, FileSignature } from 'lucide-react';
import LoadingScreen from '@/components/geargrade/loading-screen';
import AppHeader from '@/components/geargrade/header';
import SemesterCard from '@/components/geargrade/semester-card';
import { calculateGPA } from '@/lib/gpa';
import PrintReport from '@/components/geargrade/print-report';
import CgpaTrendChart from '@/components/geargrade/cgpa-trend-chart';

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
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    setCurrentYear(new Date().getFullYear());
    return () => clearTimeout(timer);
  }, []);

  const chartData = semesters.map(semester => ({
    name: semester.name,
    sgpa: parseFloat(calculateGPA(semester.courses).toFixed(2)),
  }));

  const handlePrintPdf = () => {
    window.print();
  };

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();

    const allCoursesData = semesters.flatMap(semester => 
        semester.courses.map(course => ({
            'Semester': semester.name,
            'Course Name': course.name,
            'Credits': course.credits,
            'Grade': course.grade
        }))
    );
    
    allCoursesData.push({}); // Spacer
    allCoursesData.push({ 'Semester': 'CGPA', 'Course Name': cgpa.toFixed(2) });
    allCoursesData.push({ 'Semester': 'Total Credits', 'Course Name': totalCredits.toFixed(1) });

    const ws = XLSX.utils.json_to_sheet(allCoursesData);
    XLSX.utils.book_append_sheet(wb, ws, 'Academic Report');
    XLSX.writeFile(wb, 'GearGrade_Report.xlsx');
  };

  const handleExportWord = () => {
    const semesterSections = semesters.map(semester => {
        const semesterGpa = calculateGPA(semester.courses);
        
        const courseRows = semester.courses.map(course => {
            return new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph(course.name)] }),
                    new TableCell({ children: [new Paragraph(String(course.credits))] }),
                    new TableCell({ children: [new Paragraph(course.grade)] }),
                ],
            });
        });

        const headerRow = new TableRow({
            tableHeader: true,
            children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Course Name", bold: true })]})] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Credits", bold: true })]})] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Grade", bold: true })]})] }),
            ],
        });

        return [
            new Paragraph({
                text: `${semester.name} (SGPA: ${semesterGpa.toFixed(2)})`,
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 300, after: 150 },
            }),
            new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [headerRow, ...courseRows],
            }),
        ];
    }).flat();

    const doc = new Document({
        sections: [{
            children: [
                new Paragraph({ text: "GearGrade - Academic Report", heading: HeadingLevel.HEADING_1 }),
                ...semesterSections,
                new Paragraph({
                    text: `\nOverall CGPA: ${cgpa.toFixed(2)}`,
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 400 },
                }),
                new Paragraph({
                    text: `Total Credits Earned: ${totalCredits.toFixed(1)}`,
                    heading: HeadingLevel.HEADING_2,
                }),
            ],
        }],
    });

    Packer.toBlob(doc).then(blob => {
        saveAs(blob, "GearGrade_Report.docx");
    });
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader cgpa={cgpa} totalCredits={totalCredits} />

      <main className="flex-grow container mx-auto p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 no-print">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Semesters</h1>
          <div className="flex gap-2 flex-wrap justify-center">
            <Button onClick={addSemester}>
              <Plus className="mr-2 h-4 w-4" /> Add Semester
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <FileDown className="mr-2 h-4 w-4" /> Export As
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handlePrintPdf}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>PDF</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportExcel}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  <span>Excel (.xlsx)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportWord}>
                  <FileSignature className="mr-2 h-4 w-4" />
                  <span>Word (.docx)</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

        {semesters.length > 1 && (
          <div className="mb-6">
            <CgpaTrendChart data={chartData} />
          </div>
        )}

        {semesters.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed rounded-lg no-print">
            <Cog className="mx-auto h-12 w-12 text-muted-foreground animate-spin-slow" />
            <h3 className="mt-4 text-lg font-medium">No Semesters Yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Click &quot;Add Semester&quot; to get started.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 no-print">
              {semesters.map((semester, index) => (
                <SemesterCard
                  key={semester.id}
                  semester={semester}
                  semesterIndex={index}
                  updateSemester={updateSemester}
                  deleteSemester={deleteSemester}
                  addCourse={addCourse}
                  updateCourse={updateCourse}
                  deleteCourse={deleteCourse}
                  isOnlySemester={semesters.length === 1}
                />
              ))}
            </div>
            <div className="hidden print:block">
              <PrintReport semesters={semesters} cgpa={cgpa} totalCredits={totalCredits} />
            </div>
          </>
        )}
      </main>

      <footer className="text-center p-4 text-muted-foreground text-sm no-print">
        {currentYear && <p>GearGrade &copy; {currentYear}</p>}
      </footer>
    </div>
  );
}

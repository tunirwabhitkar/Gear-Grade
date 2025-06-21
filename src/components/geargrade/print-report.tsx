'use client';

import type { Semester } from '@/types';
import { calculateGPA } from '@/lib/gpa';

interface PrintReportProps {
  semesters: Semester[];
  cgpa: number;
  totalCredits: number;
}

export default function PrintReport({ semesters, cgpa, totalCredits }: PrintReportProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8">
        GearGrade - Academic Report
      </h1>
      
      <div className="space-y-8">
        {semesters.map(semester => {
          const semesterGpa = calculateGPA(semester.courses);
          const semesterCredits = semester.courses
            .filter(course => course.grade !== 'F' && course.grade !== 'Z')
            .reduce((acc, course) => acc + (Number(course.credits) || 0), 0);
          
          return (
            <div key={semester.id} className="break-inside-avoid">
              <h2 className="text-xl font-bold mb-2">
                {semester.name}
              </h2>
              <div className="flex justify-between items-center mb-2 text-sm text-muted-foreground">
                <span>SGPA: <span className="font-semibold text-foreground">{semesterGpa.toFixed(2)}</span></span>
                <span>Credits Earned: <span className="font-semibold text-foreground">{semesterCredits.toFixed(1)}</span></span>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr className="border-b">
                      <th className="p-3 text-left font-semibold">Course Name</th>
                      <th className="p-3 text-left font-semibold w-24">Credits</th>
                      <th className="p-3 text-left font-semibold w-24">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {semester.courses.map(course => (
                      <tr key={course.id} className="border-b last:border-b-0">
                        <td className="p-3">{course.name}</td>
                        <td className="p-3">{course.credits}</td>
                        <td className="p-3">{course.grade}</td>
                      </tr>
                    ))}
                    {semester.courses.length === 0 && (
                        <tr>
                            <td colSpan={3} className="p-3 text-center text-muted-foreground">No courses in this semester.</td>
                        </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 pt-6 border-t-2 border-foreground/50">
        <div className="grid grid-cols-2 gap-4 text-xl font-bold">
            <div>
                <span>Overall CGPA: </span>
                <span>{cgpa.toFixed(2)}</span>
            </div>
            <div className="text-right">
                <span>Total Credits: </span>
                <span>{totalCredits.toFixed(1)}</span>
            </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { HelpCircle } from 'lucide-react';
import { GRADE_OPTIONS } from '@/lib/gpa';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function HelpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">Help</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>How It's Calculated</DialogTitle>
          <DialogDescription>
            Understanding the mechanics behind your academic scores.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="prose prose-sm dark:prose-invert">
            <h3 className="font-semibold">CGPA Formula</h3>
            <p>
              Your Cumulative Grade Point Average (CGPA) is calculated by dividing the total number of grade points earned by the total number of credit hours attempted.
            </p>
            <div className="p-4 bg-muted rounded-md my-4 text-center font-code">
              <p className="font-semibold">CGPA = (Σ (Grade Points × Credits)) / (Σ Credits)</p>
            </div>

            <h3 className="font-semibold mt-6">Percentage Conversion</h3>
            <p>
              The percentage is converted from your CGPA using the following formula:
            </p>
             <div className="p-4 bg-muted rounded-md my-4 text-center font-code">
              <p className="font-semibold">Percentage = (CGPA - 0.75) × 10</p>
            </div>
             <p className="text-xs text-muted-foreground mt-2">Note: The result is capped at 0% if the CGPA is below 0.75.</p>


            <h3 className="font-semibold mt-6">Grading Scale</h3>
            <p>
              This app uses a 10-point scale. Each letter grade corresponds to a specific number of grade points:
            </p>
            <div className="rounded-md border mt-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Letter Grade</TableHead>
                    <TableHead className="text-right">Grade Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {GRADE_OPTIONS.map((grade) => (
                    <TableRow key={grade.value}>
                      <TableCell>{grade.value}</TableCell>
                      <TableCell className="text-right">{grade.points.toFixed(1)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
             <div className="mt-4 prose-p:my-1 prose-ul:my-2">
              <p className="font-semibold">Notes:</p>
              <ul className="list-disc pl-5 text-sm">
                <li><span className="font-semibold">F Grade:</span> Student appeared but failed. Grade point is 0. Must reappear to pass and improve CGPA.</li>
                <li><span className="font-semibold">Z Grade:</span> Student did not complete the course. Grade point is 0. Must reappear to pass and improve CGPA.</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

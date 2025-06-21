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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>How GPA is Calculated</DialogTitle>
          <DialogDescription>
            Understanding the mechanics behind your Grade Point Average.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="prose prose-sm dark:prose-invert">
            <h3 className="font-semibold">The Formula</h3>
            <p>
              Your GPA is calculated by dividing the total number of grade points earned by the total number of credit hours attempted.
            </p>
            <div className="p-4 bg-muted rounded-md my-4 text-center font-code">
              <p className="font-semibold">GPA = (Σ (Grade Points × Credits)) / (Σ Credits)</p>
            </div>

            <h3 className="font-semibold mt-6">Grading Scale</h3>
            <p>
              This app uses a standard 4.0 scale. Each letter grade corresponds to a specific number of grade points:
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
            <p className="text-xs text-muted-foreground mt-2">The numeric grade value is used for AI suggestions.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

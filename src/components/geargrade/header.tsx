'use client';
import CgpaGauge from './cgpa-gauge';
import HelpDialog from './help-dialog';
import { Cog } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '../ui/button';

interface AppHeaderProps {
  cgpa: number;
  totalCredits: number;
}

export default function AppHeader({ cgpa, totalCredits }: AppHeaderProps) {
  const percentage = Math.max(0, (cgpa - 0.75) * 10);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 no-print">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-4 items-center">
          <Cog className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold tracking-tighter font-headline">
            GearGrade
          </h1>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="flex items-center gap-4">
             <div className="text-right">
              <p className="font-bold text-lg">{percentage.toFixed(2)}%</p>
              <p className="text-xs text-muted-foreground">Percentage</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">{totalCredits} Credits</p>
              <p className="text-xs text-muted-foreground">Total Earned</p>
            </div>
            <CgpaGauge gpa={cgpa} />
            <HelpDialog />
          </div>
        </div>
      </div>
    </header>
  );
}

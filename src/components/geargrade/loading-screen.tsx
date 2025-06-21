'use client';
import { Cog } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center gap-8">
      <div className="relative w-48 h-48">
        <Cog className="absolute top-0 left-0 w-24 h-24 text-primary animate-spin-slow" />
        <Cog className="absolute bottom-0 right-0 w-32 h-32 text-primary/70 animate-spin-slow-reverse" />
        <Cog className="absolute bottom-8 left-12 w-16 h-16 text-accent animate-spin-slow" />
      </div>
      <div className="w-64 text-center">
        <h1 className="text-3xl font-bold text-foreground font-headline">GearGrade</h1>
        <p className="text-muted-foreground mt-2">Calculating your academic trajectory...</p>
        <Progress value={progress} className="mt-4 h-2" />
      </div>
    </div>
  );
}

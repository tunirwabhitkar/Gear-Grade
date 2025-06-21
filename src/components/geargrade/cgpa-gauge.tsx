'use client';

import { useEffect, useState } from "react";

interface CgpaGaugeProps {
  gpa: number;
}

export default function CgpaGauge({ gpa }: CgpaGaugeProps) {
  const [animatedGpa, setAnimatedGpa] = useState(0);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setAnimatedGpa(gpa));
    return () => cancelAnimationFrame(animation);
  }, [gpa]);

  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const maxGpa = 4.0;
  const offset = circumference - (animatedGpa / maxGpa) * circumference;

  const getStrokeColor = (value: number) => {
    if (value >= 3.5) return 'hsl(var(--primary))';
    if (value >= 2.5) return 'hsl(var(--chart-4))';
    if (value >= 1.5) return 'hsl(var(--accent))';
    return 'hsl(var(--destructive))';
  }

  return (
    <div className="flex items-center justify-center w-24 h-16" title={`CGPA: ${gpa.toFixed(2)}`}>
      <svg className="w-full h-full" viewBox="0 0 80 80">
        <circle
          cx="40"
          cy="40"
          r={radius}
          strokeWidth="8"
          className="stroke-secondary"
          fill="transparent"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 40 40)"
          className="transition-all duration-1000 ease-out"
          style={{ stroke: getStrokeColor(animatedGpa) }}
          fill="transparent"
        />
        <text
          x="40"
          y="45"
          textAnchor="middle"
          className="text-xl font-bold fill-foreground"
        >
          {gpa.toFixed(2)}
        </text>
        <text
          x="40"
          y="62"
          textAnchor="middle"
          className="text-[10px] font-medium fill-muted-foreground"
        >
          CGPA
        </text>
      </svg>
    </div>
  );
}

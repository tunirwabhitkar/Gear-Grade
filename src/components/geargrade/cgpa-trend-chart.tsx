'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

interface CgpaTrendChartProps {
  data: {
    name: string;
    sgpa: number;
  }[];
}

const chartConfig = {
  sgpa: {
    label: 'SGPA',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export default function CgpaTrendChart({ data }: CgpaTrendChartProps) {
  return (
    <Card className="no-print">
      <CardHeader>
        <CardTitle>Performance Trend</CardTitle>
        <CardDescription>
          Your semester-wise grade point average (SGPA) over time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 10]}
              tickCount={6}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="sgpa"
              type="monotone"
              stroke="var(--color-sgpa)"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

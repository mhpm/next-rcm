'use client';

import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getMemberGrowthStats,
  PeriodType,
} from '@/app/(authenticated)/dashboard/actions/dashboard.actions';
import { useDashboardStore } from '@/app/(authenticated)/dashboard/store/dashboardStore';

type ChartData = {
  name: string;
  value: number;
};

interface GrowthChartProps {
  data: ChartData[];
}

const chartConfig = {
  value: {
    label: 'Miembros',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export default function GrowthChart({ data }: GrowthChartProps) {
  const { growthChartPeriod, setGrowthChartPeriod } = useDashboardStore();
  const [period, setPeriod] = useState<PeriodType>('month');
  const [mounted, setMounted] = useState(false);

  const [chartData, setChartData] = useState<ChartData[]>(data);
  const [, setLoading] = useState(false);

  // Sync with store on mount
  useEffect(() => {
    setMounted(true);
    setPeriod(growthChartPeriod);
  }, [growthChartPeriod]);

  // Fetch data when period changes (after mount)
  useEffect(() => {
    if (!mounted) return;

    const fetchData = async () => {
      if (period === 'month' && data.length > 0 && chartData === data) {
        // Initial state, do nothing
      } else if (period === 'month') {
        setChartData(data);
      } else {
        setLoading(true);
        try {
          const newData = await getMemberGrowthStats(period);
          setChartData(newData);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [period, mounted, data]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePeriodChange = (value: string) => {
    const newPeriod = value as PeriodType;
    setPeriod(newPeriod);
    setGrowthChartPeriod(newPeriod);
  };

  return (
    <Card className="col-span-4">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Crecimiento de la Iglesia</CardTitle>
          <CardDescription>
            Mostrando nuevos miembros por periodo
          </CardDescription>
        </div>
        <Select value={period} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto">
            <SelectValue placeholder="Seleccionar periodo" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="month" className="rounded-lg">
              Mensual
            </SelectItem>
            <SelectItem value="quarter" className="rounded-lg">
              Trimestral
            </SelectItem>
            <SelectItem value="four-month" className="rounded-lg">
              Cuatrimestral
            </SelectItem>
            <SelectItem value="year" className="rounded-lg">
              Anual
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="value"
              type="natural"
              fill="url(#fillValue)"
              fillOpacity={0.4}
              stroke="var(--color-value)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

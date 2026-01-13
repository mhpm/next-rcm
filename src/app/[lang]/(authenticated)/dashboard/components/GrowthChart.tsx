'use client';

import { useEffect, useState, useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  ChartDataPoint,
} from '@/app/[lang]/(authenticated)/dashboard/actions/dashboard.actions';
import { useDashboardStore } from '@/app/[lang]/(authenticated)/dashboard/store/dashboardStore';
import { TrendingUp, TrendingDown, Users, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface GrowthChartProps {
  data: ChartDataPoint[];
  slug?: string;
  dict: {
    label: string;
    currentPeriod: string;
    previousPeriod: string;
    title: string;
    description: string;
    placeholder: string;
    periods: {
      month: string;
      quarter: string;
      fourMonth: string;
      year: string;
    };
  };
}

export default function GrowthChart({ data, slug, dict }: GrowthChartProps) {
  const { growthChartPeriod, setGrowthChartPeriod } = useDashboardStore();
  const [period, setPeriod] = useState<PeriodType>('month');
  const [mounted, setMounted] = useState(false);

  const [chartData, setChartData] = useState<ChartDataPoint[]>(data);
  const [loading, setLoading] = useState(false);

  const chartConfig = useMemo(
    () =>
      ({
        value: {
          label: dict.currentPeriod,
          color: 'hsl(var(--primary))',
        },
        previousValue: {
          label: dict.previousPeriod,
          color: 'hsl(var(--muted-foreground) / 0.2)',
        },
      } satisfies ChartConfig),
    [dict.currentPeriod, dict.previousPeriod]
  );

  // Calculate insights
  const totals = useMemo(() => {
    const current = chartData.reduce((acc, curr) => acc + curr.value, 0);
    const previous = chartData.reduce(
      (acc, curr) => acc + (curr.previousValue || 0),
      0
    );
    const diff = current - previous;
    const percentage = previous > 0 ? (diff / previous) * 100 : 0;

    return { current, previous, diff, percentage };
  }, [chartData]);

  // Sync with store on mount
  useEffect(() => {
    setMounted(true);
    setPeriod(growthChartPeriod);
  }, [growthChartPeriod]);

  // Fetch data when period changes (after mount)
  useEffect(() => {
    if (!mounted) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const newData = await getMemberGrowthStats(period, slug);
        setChartData(newData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period, mounted, slug]);

  const handlePeriodChange = (value: string) => {
    const newPeriod = value as PeriodType;
    setPeriod(newPeriod);
    setGrowthChartPeriod(newPeriod);
  };

  return (
    <Card className="col-span-4 border-none bg-white/[0.02] backdrop-blur-sm shadow-2xl">
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-6 py-8 px-8">
        <div className="grid flex-1 gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Users className="w-4 h-4" />
            </div>
            <CardTitle className="text-xl font-black uppercase italic tracking-tight">
              {dict.title}
            </CardTitle>
          </div>
          <CardDescription className="text-sm font-medium text-muted-foreground/70">
            {dict.description}
          </CardDescription>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-full md:w-[180px] bg-white/5 border-white/10 rounded-xl h-11 font-bold uppercase tracking-wider text-xs">
              <SelectValue placeholder={dict.placeholder} />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-white/10 bg-popover/95 backdrop-blur-xl shadow-2xl">
              <SelectItem
                value="month"
                className="rounded-xl focus:bg-primary/10"
              >
                {dict.periods.month}
              </SelectItem>
              <SelectItem
                value="quarter"
                className="rounded-xl focus:bg-primary/10"
              >
                {dict.periods.quarter}
              </SelectItem>
              <SelectItem
                value="four-month"
                className="rounded-xl focus:bg-primary/10"
              >
                {dict.periods.fourMonth}
              </SelectItem>
              <SelectItem
                value="year"
                className="rounded-xl focus:bg-primary/10"
              >
                {dict.periods.year}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-8 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-1 space-y-1">
            <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">
              Total Growth
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black tracking-tighter text-foreground italic">
                {totals.current}
              </span>
              <Badge
                variant={totals.diff >= 0 ? 'default' : 'destructive'}
                className="rounded-lg font-black text-[10px] uppercase tracking-widest px-2 py-0.5"
              >
                {totals.diff >= 0 ? '+' : ''}
                {totals.percentage.toFixed(1)}%
              </Badge>
            </div>
          </div>

          <div className="md:col-span-3 flex items-center justify-end gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                {dict.currentPeriod}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted-foreground/20" />
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                {dict.previousPeriod}
              </span>
            </div>
          </div>
        </div>

        <ChartContainer
          config={chartConfig}
          className={cn(
            'aspect-auto h-[350px] w-full transition-opacity duration-500',
            loading ? 'opacity-30' : 'opacity-100'
          )}
        >
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-value)"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="fillPrevious" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-previousValue)"
                  stopOpacity={0.1}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-previousValue)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="white/5"
            />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={15}
              minTickGap={32}
              tick={{
                fill: 'hsl(var(--muted-foreground) / 0.5)',
                fontSize: 10,
                fontWeight: 700,
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={15}
              tick={{
                fill: 'hsl(var(--muted-foreground) / 0.5)',
                fontSize: 10,
                fontWeight: 700,
              }}
            />
            <ChartTooltip
              cursor={{
                stroke: 'hsl(var(--primary))',
                strokeWidth: 1,
                strokeDasharray: '4 4',
              }}
              content={
                <ChartTooltipContent
                  indicator="line"
                  className="bg-popover/95 backdrop-blur-xl border-white/10 rounded-2xl shadow-2xl p-4"
                />
              }
            />
            <Area
              dataKey="previousValue"
              type="monotone"
              fill="url(#fillPrevious)"
              stroke="var(--color-previousValue)"
              strokeWidth={2}
              strokeDasharray="5 5"
              animationDuration={1500}
            />
            <Area
              dataKey="value"
              type="monotone"
              fill="url(#fillValue)"
              stroke="var(--color-value)"
              strokeWidth={3}
              animationDuration={1000}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="px-8 py-6 border-t border-white/5 bg-white/[0.01]">
        <div className="flex items-center gap-3 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-[0.1em]">
          <Info className="w-3.5 h-3.5 text-primary" />
          {totals.diff >= 0 ? (
            <span className="flex items-center gap-1.5">
              Growth is{' '}
              <span className="text-emerald-500">
                {totals.percentage.toFixed(1)}% higher
              </span>{' '}
              than previous period
              <TrendingUp className="w-3 h-3 text-emerald-500" />
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              Growth is{' '}
              <span className="text-red-500">
                {Math.abs(totals.percentage).toFixed(1)}% lower
              </span>{' '}
              than previous period
              <TrendingDown className="w-3 h-3 text-red-500" />
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

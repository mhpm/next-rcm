import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type StatCardExtraStat = {
  label: string;
  value: string | number;
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  change: string;
  changeType: 'increase' | 'decrease';
  period: string;
  extraStats?: StatCardExtraStat[];
  isLoading?: boolean;
  action?: React.ReactNode;
  isPrimary?: boolean;
}

export const StatCard = ({
  icon,
  title,
  value,
  change,
  changeType,
  period,
  extraStats,
  isLoading,
  action,
  isPrimary = false,
}: StatCardProps) => {
  if (isLoading) {
    return (
      <Card className="p-6 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
        <Skeleton className="h-4 w-24 mb-6" />
        <Skeleton className="h-10 w-20 mb-2" />
        <Skeleton className="h-4 w-32" />
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'group relative flex flex-col items-center text-center py-6 h-full transition-all duration-300 ease-out',
        'hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1',
        'border-white/5 bg-card/50 backdrop-blur-sm overflow-hidden',
        isPrimary && 'border-primary/20 bg-primary/5 ring-1 ring-primary/10'
      )}
    >
      {/* Background Glow Effect */}
      <div
        className={cn(
          'absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl transition-all duration-500 group-hover:scale-150',
          changeType === 'increase' ? 'bg-green-500/5' : 'bg-red-500/5',
          isPrimary && 'bg-primary/10'
        )}
      />

      <CardHeader className="flex flex-col items-center space-y-2 pb-2 relative z-10">
        <div
          className={cn(
            'p-3 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg',
            isPrimary
              ? 'bg-primary text-primary-foreground shadow-primary/20'
              : 'bg-primary/10 text-primary shadow-black/5'
          )}
        >
          {icon}
        </div>
        <div className="text-4xl font-black tracking-tight mt-2 bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
          {value}
        </div>
        <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center w-full pb-2 flex-1 relative z-10">
        <div
          className={cn(
            'flex items-center px-2 py-1 rounded-full text-[10px] font-bold mt-1 transition-colors duration-300',
            changeType === 'increase'
              ? 'bg-green-500/10 text-green-500 group-hover:bg-green-500/20'
              : 'bg-red-500/10 text-red-500 group-hover:bg-red-500/20'
          )}
        >
          {changeType === 'increase' ? (
            <ArrowUpRight className="mr-0.5 h-3 w-3" />
          ) : (
            <ArrowDownRight className="mr-0.5 h-3 w-3" />
          )}
          <span>{change}</span>
          <span className="mx-1 opacity-50">•</span>
          <span className="text-muted-foreground/80">{period}</span>
        </div>

        {extraStats && extraStats.length > 0 && (
          <div className="mt-6 grid gap-2 w-full border-t border-white/5 pt-4 px-4">
            {extraStats.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between text-[11px] group/item"
              >
                <span className="font-medium text-muted-foreground group-hover/item:text-foreground transition-colors">
                  {item.label}
                </span>
                <span className="font-bold bg-secondary/50 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/5 group-hover/item:border-primary/20 transition-all">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {action && (
        <CardFooter className="w-full pt-4 pb-0 mt-auto px-4 relative z-10">
          <div className="w-full transform transition-all duration-300 group-hover:translate-y-[-2px]">
            {action}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

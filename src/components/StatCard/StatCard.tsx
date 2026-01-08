import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
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
}: StatCardProps) => {
  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-4 w-24 mb-6" />
        <Skeleton className="h-10 w-20 mb-2" />
        <Skeleton className="h-4 w-32" />
      </Card>
    );
  }

  return (
    <Card className="flex flex-col items-center text-center py-6 shadow-sm hover:shadow-md transition-shadow h-full">
      <CardHeader className="flex flex-col items-center space-y-2 pb-2">
        <div className="p-3 rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
        <div className="text-4xl font-extrabold tracking-tight mt-2">
          {value}
        </div>
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center w-full pb-2 flex-1">
        <div className="flex items-center text-xs font-medium mt-1">
          {changeType === 'increase' ? (
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
          ) : (
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
          )}
          <span
            className={
              changeType === 'increase' ? 'text-green-500' : 'text-red-500'
            }
          >
            {change}
          </span>
          <span className="ml-1 text-muted-foreground">{period}</span>
        </div>

        {extraStats && extraStats.length > 0 && (
          <div className="mt-6 grid gap-2 w-full border-t pt-4">
            {extraStats.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between text-sm"
              >
                <span className="font-semibold text-muted-foreground">
                  {item.label}
                </span>
                <span className="font-bold bg-secondary px-2 py-0.5 rounded-full">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {action && (
        <CardFooter className="w-full pt-4 pb-0 mt-auto">{action}</CardFooter>
      )}
    </Card>
  );
};

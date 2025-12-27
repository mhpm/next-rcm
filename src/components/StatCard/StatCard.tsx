import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type StatCardExtraStat = {
  label: string;
  value: string | number;
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  period: string;
  iconBg?: string; // Ignored in new design or used for icon color
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-[60px] mb-2" />
          <Skeleton className="h-4 w-[140px]" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center mt-1">
          {changeType === "increase" ? (
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
          ) : (
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
          )}
          <span
            className={
              changeType === "increase" ? "text-green-500" : "text-red-500"
            }
          >
            {change}
          </span>
          <span className="ml-1">{period}</span>
        </p>
        {extraStats && extraStats.length > 0 && (
          <div className="mt-4 grid gap-2 border-t pt-4">
            {extraStats.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium bg-secondary px-2 py-0.5 rounded-full">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}
        {action && <div className="mt-4 pt-2">{action}</div>}
      </CardContent>
    </Card>
  );
};

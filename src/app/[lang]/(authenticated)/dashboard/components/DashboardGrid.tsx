'use client';

interface DashboardGridProps {
  ministriesCard: React.ReactNode;
  cellsCard: React.ReactNode;
  membersCard: React.ReactNode;
  sectorsCard: React.ReactNode;
  chartCard: React.ReactNode;
  recentActivityCard?: React.ReactNode;
}

export function DashboardGrid({
  ministriesCard,
  cellsCard,
  membersCard,
  sectorsCard,
  chartCard,
  recentActivityCard,
}: DashboardGridProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {membersCard}
        {cellsCard}
        {ministriesCard}
        {sectorsCard}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
        <div className="lg:col-span-4 min-w-0">{chartCard}</div>
        {recentActivityCard && (
          <div className="lg:col-span-3 min-w-0">{recentActivityCard}</div>
        )}
      </div>
    </div>
  );
}

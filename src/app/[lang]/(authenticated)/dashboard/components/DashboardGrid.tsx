'use client';

interface DashboardGridProps {
  ministriesCard: React.ReactNode;
  cellsCard: React.ReactNode;
  membersCard: React.ReactNode;
  sectorsCard: React.ReactNode;
  chartCard: React.ReactNode;
}

export function DashboardGrid({
  ministriesCard,
  cellsCard,
  membersCard,
  sectorsCard,
  chartCard,
}: DashboardGridProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {membersCard}
        {cellsCard}
        {ministriesCard}
        {sectorsCard}
      </div>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
        <div className="col-span-7">{chartCard}</div>
      </div>
    </div>
  );
}

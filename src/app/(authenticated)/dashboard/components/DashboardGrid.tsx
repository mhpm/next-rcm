"use client";

import { useState, useEffect } from "react";

interface DashboardGridProps {
  ministriesCard: React.ReactNode;
  cellsCard: React.ReactNode;
  membersCard: React.ReactNode;
  groupsCard: React.ReactNode;
  reportsCard: React.ReactNode;
  sectorsCard: React.ReactNode;
  chartCard: React.ReactNode;
}

export function DashboardGrid({
  ministriesCard,
  cellsCard,
  membersCard,
  groupsCard,
  reportsCard,
  sectorsCard,
  chartCard,
}: DashboardGridProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cardsMap: Record<string, React.ReactNode> = {
    ministries: ministriesCard,
    cells: cellsCard,
    members: membersCard,
    groups: groupsCard,
    reports: reportsCard,
    sectors: sectorsCard,
    chart: chartCard,
  };

  // Static layout configuration
  // Left Column (2/12): 3 small items
  const leftColumnIds = ["members", "reports", "sectors"];

  // Center Column (7/12): 1 large item (Chart)
  const centerColumnId = "chart";

  // Right Column (3/12): 3 medium items (Groups moved here)
  const rightColumnIds = ["cells", "ministries", "groups"];

  if (!mounted) {
    // Render static layout immediately for SSR match
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - 2/12 */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {leftColumnIds.map((id) => (
            <div key={id}>{cardsMap[id]}</div>
          ))}
        </div>

        {/* Center Column - 7/12 */}
        <div className="lg:col-span-6">
          <div className="">{cardsMap[centerColumnId]}</div>
        </div>

        {/* Right Column - 3/12 */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {rightColumnIds.map((id) => (
            <div key={id}>{cardsMap[id]}</div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column - 2/12 */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        {leftColumnIds.map((id) => (
          <div key={id} className="w-full">
            {cardsMap[id]}
          </div>
        ))}
      </div>

      {/* Center Column - 7/12 */}
      <div className="lg:col-span-6">
        <div className="h-[calc(100vh-200px)] w-full">
          {cardsMap[centerColumnId]}
        </div>
      </div>

      {/* Right Column - 3/12 */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        {rightColumnIds.map((id) => (
          <div key={id} className="w-full">
            {cardsMap[id]}
          </div>
        ))}
      </div>
    </div>
  );
}

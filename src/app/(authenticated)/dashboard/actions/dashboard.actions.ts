"use server";

import { getChurchPrisma } from "@/actions/churchContext";

export type ChartDataPoint = {
  name: string;
  value: number;
};

export async function getMemberGrowthStats(): Promise<ChartDataPoint[]> {
  const prisma = await getChurchPrisma();

  // Get start and end of current year
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1); // Jan 1st
  startOfYear.setHours(0, 0, 0, 0);

  const endOfYear = new Date(now.getFullYear(), 11, 31); // Dec 31st
  endOfYear.setHours(23, 59, 59, 999);

  const members = await prisma.members.findMany({
    where: {
      createdAt: {
        gte: startOfYear,
        lte: endOfYear,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Initialize all 12 months with 0
  const monthlyStats = new Map<string, number>();
  const monthNames = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  // Set all months of current year
  monthNames.forEach((month) => {
    monthlyStats.set(month, 0);
  });

  // Count members per month
  members.forEach((member: { createdAt: Date }) => {
    const date = new Date(member.createdAt);
    // Ensure we only count members from the same year (though query filters it, good for safety)
    if (date.getFullYear() === now.getFullYear()) {
      const monthKey = `${monthNames[date.getMonth()]}`;
      if (monthlyStats.has(monthKey)) {
        monthlyStats.set(monthKey, (monthlyStats.get(monthKey) || 0) + 1);
      }
    }
  });

  return Array.from(monthlyStats.entries()).map(([name, value]) => ({
    name,
    value,
  }));
}

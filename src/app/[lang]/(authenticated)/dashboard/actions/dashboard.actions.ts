"use server";

import { getChurchPrisma } from "@/actions/churchContext";

export type ChartDataPoint = {
  name: string;
  value: number;
};

export type PeriodType = "month" | "quarter" | "four-month" | "year";

export async function getMemberGrowthStats(
  period: PeriodType = "month",
  churchSlug?: string
): Promise<ChartDataPoint[]> {
  const prisma = await getChurchPrisma(churchSlug);
  const now = new Date();

  // Logic for different periods
  if (period === "year") {
    // Last 5 years
    const startYear = now.getFullYear() - 4;
    const startDate = new Date(startYear, 0, 1);
    const endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

    const members = await prisma.members.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: { createdAt: true },
    });

    const yearStats = new Map<string, number>();
    for (let i = startYear; i <= now.getFullYear(); i++) {
      yearStats.set(i.toString(), 0);
    }

    members.forEach((member) => {
      const year = new Date(member.createdAt).getFullYear().toString();
      if (yearStats.has(year)) {
        yearStats.set(year, (yearStats.get(year) || 0) + 1);
      }
    });

    return Array.from(yearStats.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }

  // Common logic for sub-year periods (current year)
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

  const members = await prisma.members.findMany({
    where: {
      createdAt: {
        gte: startOfYear,
        lte: endOfYear,
      },
    },
    select: { createdAt: true },
  });

  const stats = new Map<string, number>();

  if (period === "quarter") {
    const quarters = ["Q1", "Q2", "Q3", "Q4"];
    quarters.forEach((q) => stats.set(q, 0));

    members.forEach((member) => {
      const month = new Date(member.createdAt).getMonth(); // 0-11
      const qIndex = Math.floor(month / 3);
      const qKey = quarters[qIndex];
      stats.set(qKey, (stats.get(qKey) || 0) + 1);
    });
  } else if (period === "four-month") {
    const periods = ["1er C", "2do C", "3er C"];
    periods.forEach((p) => stats.set(p, 0));

    members.forEach((member) => {
      const month = new Date(member.createdAt).getMonth();
      const pIndex = Math.floor(month / 4);
      const pKey = periods[pIndex];
      stats.set(pKey, (stats.get(pKey) || 0) + 1);
    });
  } else {
    // Month (default)
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
    monthNames.forEach((m) => stats.set(m, 0));

    members.forEach((member) => {
      const month = new Date(member.createdAt).getMonth();
      const mKey = monthNames[month];
      stats.set(mKey, (stats.get(mKey) || 0) + 1);
    });
  }

  return Array.from(stats.entries()).map(([name, value]) => ({
    name,
    value,
  }));
}

'use server';

import { getChurchPrisma } from '@/actions/churchContext';

export type ChartDataPoint = {
  name: string;
  value: number;
  previousValue?: number;
};

export type PeriodType = 'month' | 'quarter' | 'four-month' | 'year';

export async function getMemberGrowthStats(
  period: PeriodType = 'month',
  churchSlug?: string
): Promise<ChartDataPoint[]> {
  const prisma = await getChurchPrisma(churchSlug);
  const now = new Date();

  // Logic for different periods
  if (period === 'year') {
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

  // Common logic for sub-year periods (current vs previous year)
  const startOfCurrentYear = new Date(now.getFullYear(), 0, 1);
  const endOfCurrentYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

  const startOfPreviousYear = new Date(now.getFullYear() - 1, 0, 1);
  const endOfPreviousYear = new Date(
    now.getFullYear() - 1,
    11,
    31,
    23,
    59,
    59,
    999
  );

  const [currentYearMembers, previousYearMembers] = await Promise.all([
    prisma.members.findMany({
      where: { createdAt: { gte: startOfCurrentYear, lte: endOfCurrentYear } },
      select: { createdAt: true },
    }),
    prisma.members.findMany({
      where: {
        createdAt: { gte: startOfPreviousYear, lte: endOfPreviousYear },
      },
      select: { createdAt: true },
    }),
  ]);

  const stats = new Map<string, { current: number; previous: number }>();

  if (period === 'quarter') {
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    quarters.forEach((q) => stats.set(q, { current: 0, previous: 0 }));

    currentYearMembers.forEach((m) => {
      const qIndex = Math.floor(new Date(m.createdAt).getMonth() / 3);
      const qKey = quarters[qIndex];
      const s = stats.get(qKey)!;
      s.current++;
    });

    previousYearMembers.forEach((m) => {
      const qIndex = Math.floor(new Date(m.createdAt).getMonth() / 3);
      const qKey = quarters[qIndex];
      const s = stats.get(qKey)!;
      s.previous++;
    });
  } else if (period === 'four-month') {
    const periods = ['1er C', '2do C', '3er C'];
    periods.forEach((p) => stats.set(p, { current: 0, previous: 0 }));

    currentYearMembers.forEach((m) => {
      const pIndex = Math.floor(new Date(m.createdAt).getMonth() / 4);
      const pKey = periods[pIndex];
      const s = stats.get(pKey)!;
      s.current++;
    });

    previousYearMembers.forEach((m) => {
      const pIndex = Math.floor(new Date(m.createdAt).getMonth() / 4);
      const pKey = periods[pIndex];
      const s = stats.get(pKey)!;
      s.previous++;
    });
  } else {
    // Default: month
    const months = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];
    months.forEach((m) => stats.set(m, { current: 0, previous: 0 }));

    currentYearMembers.forEach((m) => {
      const mKey = months[new Date(m.createdAt).getMonth()];
      const s = stats.get(mKey)!;
      s.current++;
    });

    previousYearMembers.forEach((m) => {
      const mKey = months[new Date(m.createdAt).getMonth()];
      const s = stats.get(mKey)!;
      s.previous++;
    });
  }

  return Array.from(stats.entries()).map(([name, s]) => ({
    name,
    value: s.current,
    previousValue: s.previous,
  }));
}

export type RecentActivity = {
  id: string;
  type: 'member' | 'report';
  title: string;
  subtitle: string;
  amount?: string;
  status: string;
  date: Date;
  icon: string;
};

export async function getRecentActivity(
  limit: number = 5,
  churchSlug?: string
): Promise<RecentActivity[]> {
  const prisma = await getChurchPrisma(churchSlug);

  const [members, reportEntries] = await Promise.all([
    prisma.members.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.reportEntries.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        report: {
          select: {
            title: true,
          },
        },
        cell: {
          select: {
            name: true,
          },
        },
      },
    }),
  ]);

  const activities: RecentActivity[] = [
    ...members.map((m) => ({
      id: m.id,
      type: 'member' as const,
      title: `${m.firstName} ${m.lastName}`,
      subtitle: m.role,
      status: 'NEW_MEMBER',
      date: m.createdAt,
      icon: 'user',
    })),
    ...reportEntries.map((re) => ({
      id: re.id,
      type: 'report' as const,
      title: re.report.title,
      subtitle: re.cell?.name || 'Global',
      status: re.status,
      date: re.createdAt,
      icon: 'file',
    })),
  ];

  return activities
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, limit);
}

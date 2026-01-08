'use server';

import { getChurchPrisma, getChurchId } from '@/actions/churchContext';
import { CellTrackingStats, TrackingDashboardData } from '../types/tracking.d';

export async function getTrackingStats(): Promise<TrackingDashboardData> {
  const prisma = await getChurchPrisma();
  const churchId = await getChurchId();

  // 1. Fetch all events (to ensure we show columns for all relevant events, or just fetch active ones)
  // For now, fetch all events. In production, might want to filter by year/active.
  const events = await prisma.events.findMany({
    where: { church_id: churchId },
    orderBy: { date: 'asc' },
  });

  // 2. Fetch cells with their friends (and their attendances) and goals
  const cells = await prisma.cells.findMany({
    where: { church_id: churchId },
    include: {
      leader: {
        select: { firstName: true, lastName: true },
      },
      friends: {
        include: {
          attendances: true,
        },
      },
      goals: {
        include: {
          event: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  // 3. Process data to build stats
  const cellStats: CellTrackingStats[] = cells.map((cell) => {
    // Calculate actuals for each event goal
    // We want to show ALL events, or just events with goals?
    // Usually a dashboard shows all key events.
    // Let's map over the fetched `events` to ensure consistent columns.

    const goalsProgress = events.map((event) => {
      // Find explicit goal if set
      const goal = cell.goals.find((g) => g.event_id === event.id);
      const target = goal?.target || 0;

      // Calculate actual attendance
      // Count friends of this cell who have an attendance record for this event
      const actual = cell.friends.reduce((count, friend) => {
        const attended = friend.attendances.some(
          (a) => a.event_id === event.id && a.attended
        );
        return count + (attended ? 1 : 0);
      }, 0);

      return {
        eventId: event.id,
        eventName: event.name,
        eventDate: event.date,
        target,
        actual,
      };
    });

    return {
      cellId: cell.id,
      cellName: cell.name,
      leaderName: cell.leader
        ? `${cell.leader.firstName} ${cell.leader.lastName}`
        : 'Sin líder',
      totalFriends: cell.friends.length,
      totalBaptized: cell.friends.filter((f) => f.isBaptized).length,
      goals: goalsProgress,
    };
  });

  return {
    cells: cellStats,
    events,
  };
}

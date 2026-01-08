import { CellGoals, Cells, Events, Friends } from "@/generated/prisma/client";

export interface GoalProgress {
  eventId: string;
  eventName: string;
  eventDate: Date;
  target: number;
  actual: number;
}

export interface CellTrackingStats {
  cellId: string;
  cellName: string;
  leaderName: string;
  totalFriends: number;
  totalBaptized: number;
  goals: GoalProgress[];
}

export interface TrackingDashboardData {
  cells: CellTrackingStats[];
  events: Events[]; // All events for reference
}

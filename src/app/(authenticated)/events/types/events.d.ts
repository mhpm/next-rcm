import type {
  Events,
  EventAttendances,
  CellGoals,
} from '@/generated/prisma/client';

export type EventWithStats = Events & {
  _count: {
    attendances: number;
  };
};

export interface EventFormData {
  id?: string;
  name: string;
  date: Date;
  type: string;
  friendAttendanceGoal?: number | null;
  memberAttendanceGoal?: number | null;
}

export interface EventsQueryOptions {
  limit?: number;
  offset?: number;
  search?: string;
  orderBy?: 'date' | 'name' | 'createdAt';
  orderDirection?: 'asc' | 'desc';
}

export interface EventsListResult {
  events: EventWithStats[];
  total: number;
  hasMore: boolean;
}

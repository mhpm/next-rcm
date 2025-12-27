import type {
  Events,
  EventAttendances,
  CellGoals,
  EventPhases,
} from '@/generated/prisma/client';

export type EventWithStats = Events & {
  phase?: EventPhases | null;
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
  phase_id?: string | null;
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

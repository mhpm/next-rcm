import type { Members } from '@/generated/prisma/client';
import type { GroupTableData } from '../types/groups';

export function transformGroupsToTableData(
  groups: {
    id: string;
    name: string;
    leader: Members | null;
    _count: { members: number };
    createdAt: Date;
    updatedAt: Date;
  }[]
): GroupTableData[] {
  return groups.map((g) => ({
    id: g.id,
    name: g.name,
    leaderName: g.leader
      ? `${g.leader.firstName} ${g.leader.lastName}`
      : 'Sin líder',
    leaderId: g.leader?.id ?? null,
    memberCount: g._count.members || 0,
    createdAt: new Date(g.createdAt).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    updatedAt: new Date(g.updatedAt).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
  }));
}

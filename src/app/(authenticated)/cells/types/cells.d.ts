import type { Prisma } from "@/generated/prisma/client";

export interface CellsQueryOptions {
  limit?: number;
  offset?: number;
  search?: string;
  orderBy?: "name" | "createdAt";
  orderDirection?: "asc" | "desc";
}

export interface CellTableData {
  id: string;
  name: string;
  sectorName?: string;
  leaderName: string;
  hostName: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface CellsListResult<T = unknown> {
  cells: T[];
  total: number;
  hasMore: boolean;
}

export type CellWithRelations = Prisma.CellsGetPayload<{
  include: { leader: true; host: true; sector: true; members: true };
}>;

export type CellListItem = Prisma.CellsGetPayload<{
  include: {
    leader: true;
    host: true;
    sector: true;
    _count: { select: { members: true } };
  };
}> & { memberCount: number };

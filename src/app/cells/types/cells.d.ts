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
  sectorName: string;
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

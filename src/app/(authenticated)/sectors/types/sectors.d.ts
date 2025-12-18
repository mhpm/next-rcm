import type { Sectors, Members } from "@prisma/client";

// ============ TYPES ============

export interface SectorResponse {
  success: boolean;
  data: Sectors;
  error?: string;
  message?: string;
}

export interface SectorsResponse {
  success: boolean;
  data: Sectors[];
  total: number;
  hasMore: boolean;
  error?: string;
}

export interface SectorsQueryOptions {
  limit?: number;
  offset?: number;
  search?: string;
  orderBy?: "name" | "createdAt";
  orderDirection?: "asc" | "desc";
}

export interface SectorFormData {
  name: string;
  supervisorId?: string | null;
  zoneId?: string | null;
}

export interface SubSectorFormData {
  name: string;
  sectorId: string;
  supervisorId?: string | null;
}

// ============ TABLE TYPES ============

export interface SectorTableData {
  id: string;
  name: string;
  supervisorName?: string; // Name of the supervisor (if exists)
  supervisorId?: string | null; // ID of the supervisor for navigation
  parentName?: string; // Name of the parent sector (if exists)
  parentId?: string | null; // ID of the parent sector
  cellsCount: number;
  membersCount: number;
  subSectorsCount: number;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown; // Index signature for DataTable compatibility
}

export interface CellNode {
  id: string;
  name: string;
  leaderName: string;
  hostName: string;
  assistantName: string;
  membersCount: number;
}

export interface SectorNode {
  id: string;
  name: string;
  type: "SECTOR" | "SUB_SECTOR";
  supervisorName?: string;
  supervisorId?: string | null;
  membersCount: number;
  cellsCount: number;
  subSectorsCount: number;
  children: SectorNode[];
  cells?: CellNode[];
}

export type SectorWithDetails = Sectors & {
  supervisor?: Members | null;
  zone?: Zones | null;
  cellsCount?: number;
  membersCount?: number;
  subSectorsCount?: number;
  _count?: {
    cells: number;
    members: number;
    subSectors: number;
  };
};

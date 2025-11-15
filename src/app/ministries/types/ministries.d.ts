import type { Ministries } from "@prisma/client";

// ============ TYPES ============

export interface MinistryResponse {
  success: boolean;
  data: Ministries;
  error?: string;
  message?: string;
}

export interface MinistriesResponse {
  success: boolean;
  data: Ministries[];
  total: number;
  hasMore: boolean;
  error?: string;
}

export interface MinistriesQueryOptions {
  limit?: number;
  offset?: number;
  search?: string;
  orderBy?: "name" | "createdAt";
  orderDirection?: "asc" | "desc";
}

export interface MinistryFormData {
  name: string;
  description?: string;
  leaderId?: string | null;
}

// ============ TABLE TYPES ============

export interface MinistryTableData {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown; // Index signature for DataTable compatibility
}

export type MinistryWithMemberCount = Ministries & {
  memberCount: number;
}

import type { Friends, Cells, Members } from "@/generated/prisma/client";

// Friend with relations
export type FriendWithRelations = Friends & {
  cell: Cells;
  invitedBy: Members | null;
  spiritualFather: Members;
};

// Form-specific interface for creating/updating friends
export interface FriendFormData {
  id?: string;
  name: string;
  phone?: string | null;
  cell_id: string;
  invited_by_id?: string | null;
  spiritual_father_id: string;
  isBaptized?: boolean;
}

// Table data type
export interface FriendTableData {
  id: string;
  name: string;
  phone: string;
  cellName: string;
  invitedByName: string;
  spiritualFatherName: string;
  isBaptized: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FriendsQueryOptions {
  limit?: number;
  offset?: number;
  search?: string;
  cellId?: string;
  isBaptized?: boolean;
  orderBy?: "name" | "createdAt";
  orderDirection?: "asc" | "desc";
}

export interface FriendsListResult {
  friends: FriendWithRelations[];
  total: number;
  hasMore: boolean;
}

export interface GroupsQueryOptions {
  limit?: number;
  offset?: number;
  search?: string;
  orderBy?: 'name' | 'createdAt';
  orderDirection?: 'asc' | 'desc';
}

export interface GroupFormData {
  name: string;
  leaderId?: string | null;
  parentId?: string | null;
}

export interface GroupTableData {
  id: string;
  name: string;
  leaderName?: string;
  leaderId?: string | null;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface GroupFieldItem {
  key: string;
  label?: string | null;
  type: string;
  value?: unknown;
}

export interface GroupNode {
  id: string;
  name: string;
  leaderName?: string;
  leaderId?: string | null;
  memberCount: number;
  fields: GroupFieldItem[];
  children: GroupNode[];
}

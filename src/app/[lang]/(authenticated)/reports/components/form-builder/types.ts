import type { ReportFieldType, ReportScope } from '@/generated/prisma/client';

export type FieldItem = {
  id?: string;
  tempId?: string; // Stable ID for UI state (persistence across moves)
  fieldId?: string; // Only for edit mode (existing DB id)
  key: string;
  label?: string | null;
  description?: string | null;
  type: ReportFieldType;
  value?: unknown;
  options?: { value: string; description?: string }[];
  required?: boolean;
  visibilityRules?: VisibilityRule[];
  validation?: any;
};

export type VisibilityRule = {
  fieldKey: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'gt' | 'lt';
  value: string;
};

export type GroupItem = {
  id: string;
  type: 'SECTION' | 'FIELD';
  field: FieldItem;
  index: number;
  children: { field: FieldItem; index: number }[];
  endIndex: number;
};

export type ReportFormValues = {
  title: string;
  description?: string | null;
  scope: ReportScope;
  fields: FieldItem[];
  color?: string | null;
};

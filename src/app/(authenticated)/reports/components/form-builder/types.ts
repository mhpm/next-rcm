import type { ReportFieldType, ReportScope } from "@/generated/prisma/client";

export type FieldItem = {
  id?: string;
  tempId?: string; // Stable ID for UI state (persistence across moves)
  fieldId?: string; // Only for edit mode (existing DB id)
  key: string;
  label?: string | null;
  type: ReportFieldType;
  value?: unknown;
  options?: { value: string }[];
  required?: boolean;
};

export type ReportFormValues = {
  title: string;
  description?: string | null;
  scope: ReportScope;
  fields: FieldItem[];
  color?: string | null;
};

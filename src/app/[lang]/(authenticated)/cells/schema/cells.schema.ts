import { z } from "zod";
// Removed generated model schema usage; using plain Zod definitions

export const optionalString = z.preprocess(
  (v) => (v === "" || v === undefined ? undefined : v),
  z.union([z.string(), z.undefined()])
);

export const cellFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "El nombre es requerido"),
  sectorId: z.string(),
  subSectorId: z.string().optional(),
  leaderId: z.string(),
  hostId: z.string(),
  assistantId: z.string().optional(),
  accessCode: z.string().optional(),
});

export const cellCreateSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  sectorId: z.string(),
  subSectorId: z.string().optional(),
  accessCode: z.string().optional(),
});

export const cellUpdateSchema = z.object({
  name: z.string().optional(),
  sectorId: optionalString,
  subSectorId: optionalString,
  leaderId: optionalString,
  hostId: optionalString,
  assistantId: optionalString,
  accessCode: optionalString,
});

export type CellFormInput = {
  id?: string;
  name: string;
  sectorId: string;
  subSectorId?: string;
  leaderId: string;
  hostId: string;
  assistantId?: string;
  accessCode?: string;
};

export type CellCreateInput = {
  name: string;
  sectorId: string;
  subSectorId?: string;
  accessCode?: string;
};

export type CellUpdateInput = {
  name?: string;
  sectorId?: string | undefined;
  subSectorId?: string | undefined;
  leaderId?: string | undefined;
  hostId?: string | undefined;
  assistantId?: string | undefined;
  accessCode?: string | undefined;
};

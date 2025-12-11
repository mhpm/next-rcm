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
  leaderId: z.string(),
  hostId: z.string(),
});

export const cellCreateSchema = z.object({
  name: z.string().min(1),
  sectorId: z.string(),
});

export const cellUpdateSchema = z.object({
  name: z.string().optional(),
  sectorId: optionalString,
  leaderId: optionalString,
  hostId: optionalString,
});

export type CellFormInput = {
  id?: string;
  name: string;
  sectorId: string;
  leaderId: string;
  hostId: string;
};

export type CellCreateInput = {
  name: string;
  sectorId: string;
};

export type CellUpdateInput = {
  name?: string;
  sectorId?: string | undefined;
  leaderId?: string | undefined;
  hostId?: string | undefined;
};

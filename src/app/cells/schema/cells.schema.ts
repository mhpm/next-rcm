import { z } from "zod";
import { CellsModelSchema } from "@/generated/schemas/variants/pure/Cells.pure";

export const optionalString = z.preprocess(
  (v) => (v === "" || v === undefined ? undefined : v),
  z.union([z.string(), z.undefined()])
);

export const cellFormSchema = z.object({
  id: CellsModelSchema.shape.id.optional(),
  name: CellsModelSchema.shape.name.min(1, "El nombre es requerido"),
  sectorId: z.string(),
  leaderId: z.string(),
  hostId: z.string(),
});

export const cellCreateSchema = z.object({
  name: CellsModelSchema.shape.name.min(1),
  sectorId: z.string(),
});

export const cellUpdateSchema = z.object({
  name: CellsModelSchema.shape.name.optional(),
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

import { z } from "zod";

export const optionalString = z.preprocess(
  (v) => (v === "" || v === undefined ? undefined : v),
  z.union([z.string(), z.undefined()])
);

export const sectorFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "El nombre es requerido"),
  supervisorId: z.union([z.string(), z.null()]).optional(),
  zoneId: z.union([z.string(), z.null()]).optional(),
  parentId: z.union([z.string(), z.null()]).optional(),
});

export const sectorCreateSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  supervisorId: z.union([z.string(), z.null()]).optional(),
  zoneId: z.union([z.string(), z.null()]).optional(),
  parentId: z.union([z.string(), z.null()]).optional(),
});

export const sectorUpdateSchema = z.object({
  name: z.string().optional(),
  supervisorId: optionalString,
  zoneId: optionalString,
});

export type SectorFormInput = {
  id?: string;
  name: string;
  supervisorId?: string | null;
  zoneId?: string | null;
  parentId?: string | null;
};

export type SectorCreateInput = {
  name: string;
  supervisorId?: string | null | undefined;
  zoneId?: string | null | undefined;
};

export type SectorUpdateInput = {
  name?: string;
  supervisorId?: string | undefined;
  zoneId?: string | undefined;
  parentId?: string | undefined;
};

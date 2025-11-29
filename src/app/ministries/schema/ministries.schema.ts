import { z } from "zod";
// Removed generated model schema usage; using plain Zod definitions

export const optionalString = z.preprocess(
  (v) => (v === "" || v === undefined ? undefined : v),
  z.union([z.string(), z.undefined()])
);

export const ministryFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  leaderId: z.union([z.string(), z.null()]).optional(),
});

export const ministryCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  leaderId: z.union([z.string(), z.null()]).optional(),
});

export const ministryUpdateSchema = z.object({
  name: z.string().optional(),
  description: optionalString,
  leaderId: optionalString,
});

export type MinistryFormInput = {
  id?: string;
  name: string;
  description?: string;
  leaderId?: string | null;
};

export type MinistryCreateInput = {
  name: string;
  description?: string;
  leaderId?: string | null | undefined;
};

export type MinistryUpdateInput = {
  name?: string;
  description?: string | undefined;
  leaderId?: string | undefined;
};

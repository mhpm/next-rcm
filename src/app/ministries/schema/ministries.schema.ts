import { z } from "zod";
import { MinistriesModelSchema } from "@/generated/zod/schemas/variants/pure/Ministries.pure";

export const optionalString = z.preprocess(
  (v) => (v === "" || v === undefined ? undefined : v),
  z.union([z.string(), z.undefined()])
);

export const ministryFormSchema = z.object({
  id: MinistriesModelSchema.shape.id.optional(),
  name: MinistriesModelSchema.shape.name.min(1, "El nombre es requerido"),
  description: z.string().optional(),
  leaderId: z.union([z.string(), z.null()]).optional(),
});

export const ministryCreateSchema = z.object({
  name: MinistriesModelSchema.shape.name.min(1),
  description: z.string().optional(),
  leaderId: z.union([z.string(), z.null()]).optional(),
});

export const ministryUpdateSchema = z.object({
  name: MinistriesModelSchema.shape.name.optional(),
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

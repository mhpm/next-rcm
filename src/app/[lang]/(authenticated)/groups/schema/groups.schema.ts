import { z } from "zod";

export const groupFieldSchema = z.object({
  id: z.string().optional(),
  key: z.string().min(1, "La clave es requerida"),
  label: z.string().min(1, "La etiqueta es requerida"),
  type: z.enum(["TEXT", "NUMBER", "BOOLEAN", "DATE", "JSON"]),
  value: z.any().optional(),
});

export const groupCreateSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  leaderId: z.string().optional().or(z.literal("")),
  parentId: z.string().optional().or(z.literal("")),
  fields: z.array(groupFieldSchema).optional(),
});

export type GroupFieldSchema = z.infer<typeof groupFieldSchema>;
export type GroupCreateSchema = z.infer<typeof groupCreateSchema>;

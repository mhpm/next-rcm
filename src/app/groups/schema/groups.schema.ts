import { z } from "zod";

export const groupCreateSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  leaderId: z.string().optional().or(z.literal("")),
  parentId: z.string().optional().or(z.literal("")),
});

export type GroupCreateSchema = z.infer<typeof groupCreateSchema>;

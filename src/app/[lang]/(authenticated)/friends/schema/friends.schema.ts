import { z } from "zod";

export const friendSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  phone: z
    .string()
    .optional()
    .nullable(),
  cell_id: z.string().min(1, "La célula es requerida"),
  invited_by_id: z.string().optional().nullable(),
  spiritual_father_id: z.string().min(1, "El padre espiritual es requerido"),
  isBaptized: z.boolean().default(false),
});

export type FriendFormValues = z.infer<typeof friendSchema>;

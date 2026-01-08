import { z } from 'zod';

export const phaseSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'El nombre es requerido').max(50, 'El nombre no puede exceder 50 caracteres'),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Debe ser un código hexadecimal válido (ej. #FF0000)').optional(),
});

export type PhaseFormValues = z.infer<typeof phaseSchema>;

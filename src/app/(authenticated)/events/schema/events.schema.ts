import { z } from 'zod';

export const eventSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  date: z.coerce.date({ message: 'La fecha es requerida' }),
  type: z
    .string()
    .min(1, 'El tipo de evento es requerido')
    .max(50, 'El tipo no puede exceder 50 caracteres'),
  friendAttendanceGoal: z.coerce
    .number()
    .min(0, 'La meta debe ser mayor o igual a 0')
    .optional()
    .nullable(),
  memberAttendanceGoal: z.coerce
    .number()
    .min(0, 'La meta debe ser mayor o igual a 0')
    .optional()
    .nullable(),
});

export type EventFormValues = z.infer<typeof eventSchema>;

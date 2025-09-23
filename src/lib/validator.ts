import { z } from 'zod';

// Enum schemas matching the TypeScript types
const MemberRoleSchema = z.enum([
  'MIEMBRO',
  'SUPERVISOR',
  'LIDER',
  'ANFITRION',
]);
const GenderSchema = z.enum(['MASCULINO', 'FEMENINO']);

// Main member validation schema for form data
export const memberSchema = z
  .object({
    // Optional fields
    id: z.string().optional(),
    // Required fields
    firstName: z
      .string()
      .min(1, 'El nombre es requerido')
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(50, 'El nombre no puede exceder 50 caracteres')
      .regex(
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        'El nombre solo puede contener letras y espacios'
      ),

    lastName: z
      .string()
      .min(1, 'El apellido es requerido')
      .min(2, 'El apellido debe tener al menos 2 caracteres')
      .max(50, 'El apellido no puede exceder 50 caracteres')
      .regex(
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        'El apellido solo puede contener letras y espacios'
      ),

    email: z
      .string()
      .min(1, 'El email es requerido')
      .email({ message: 'Formato de email inválido' })
      .max(100, 'El email no puede exceder 100 caracteres')
      .toLowerCase(),

    role: MemberRoleSchema,

    gender: GenderSchema,

    // Optional fields with validation
    phone: z
      .string()
      .optional()
      .refine((val) => !val || /^[\d\s\-\+\(\)]+$/.test(val), {
        message: 'Formato de teléfono inválido',
      }),

    age: z
      .number()
      .int('La edad debe ser un número entero')
      .min(1, 'La edad debe ser mayor a 0')
      .max(120, 'La edad no puede ser mayor a 120')
      .optional(),

    // Address fields
    street: z
      .string()
      .max(100, 'La dirección no puede exceder 100 caracteres')
      .optional(),

    city: z
      .string()
      .max(50, 'La ciudad no puede exceder 50 caracteres')
      .optional(),

    state: z
      .string()
      .max(50, 'El estado no puede exceder 50 caracteres')
      .optional(),

    zip: z
      .string()
      .max(20, 'El código postal no puede exceder 20 caracteres')
      .optional(),

    country: z
      .string()
      .max(50, 'El país no puede exceder 50 caracteres')
      .optional(),

    // Date fields
    birthDate: z
      .date()
      .max(new Date(), 'La fecha de nacimiento no puede ser futura'),

    baptismDate: z
      .date()
      .max(new Date(), 'La fecha de bautismo no puede ser futura'),

    // Church-specific fields
    ministerio: z
      .string()
      .max(100, 'El ministerio no puede exceder 100 caracteres')
      .optional(),

    notes: z
      .string()
      .max(500, 'Las notas no pueden exceder 500 caracteres')
      .optional(),

    skills: z
      .array(
        z.string().max(50, 'Cada habilidad no puede exceder 50 caracteres')
      )
      .max(10, 'No se pueden agregar más de 10 habilidades')
      .optional(),

    // Password fields for new members
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(100, 'La contraseña no puede exceder 100 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
      )
      .optional(),

    confirmPassword: z.string().optional(),

    // File upload field
    picture: z
      .array(z.instanceof(File))
      .max(1, 'Solo se puede subir una imagen')
      .optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .refine(
    (data) => {
      // Custom validation: if password is provided, confirmPassword must match
      if (data.password && data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: 'Las contraseñas no coinciden',
      path: ['confirmPassword'],
    }
  )
  .refine(
    (data) => {
      // Custom validation: baptism date should be after birth date
      if (data.birthDate && data.baptismDate) {
        return data.baptismDate >= data.birthDate;
      }
      return true;
    },
    {
      message:
        'La fecha de bautismo debe ser posterior a la fecha de nacimiento',
      path: ['baptismDate'],
    }
  );

// Schema for updating members (all fields optional except id)
export const updateMemberSchema = memberSchema.partial().extend({
  id: z.string().min(1, 'ID es requerido'),
});

// Schema for member search/filtering
export const memberSearchSchema = z.object({
  search: z.string().optional(),
  role: MemberRoleSchema.optional(),
  gender: GenderSchema.optional(),
  ministerio: z.string().optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

// Form-specific schema for client-side validation (dates as strings)
export const insertMemberFormSchema = memberSchema
  .extend({
    birthDate: z
      .string()
      .optional()
      .refine((val) => !val || !isNaN(Date.parse(val)), {
        message: 'Formato de fecha inválido',
      })
      .refine((val) => !val || new Date(val) <= new Date(), {
        message: 'La fecha de nacimiento no puede ser futura',
      }),

    baptismDate: z
      .string()
      .optional()
      .refine((val) => !val || !isNaN(Date.parse(val)), {
        message: 'Formato de fecha inválido',
      })
      .refine((val) => !val || new Date(val) <= new Date(), {
        message: 'La fecha de bautismo no puede ser futura',
      }),
  })
  .refine(
    (data) => {
      // Custom validation: baptism date should be after birth date
      if (data.birthDate && data.baptismDate) {
        const birthDate = new Date(data.birthDate);
        const baptismDate = new Date(data.baptismDate);
        return baptismDate >= birthDate;
      }
      return true;
    },
    {
      message:
        'La fecha de bautismo debe ser posterior a la fecha de nacimiento',
      path: ['baptismDate'],
    }
  );

// Export types for use in components
export type MemberSchema = z.infer<typeof memberSchema>;
export type InsertMemberFormSchema = z.infer<typeof insertMemberFormSchema>;
export type UpdateMemberSchema = z.infer<typeof updateMemberSchema>;
export type MemberSearchSchema = z.infer<typeof memberSearchSchema>;

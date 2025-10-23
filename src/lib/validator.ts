import { z } from "zod";

// Enum schemas matching the TypeScript types
const MemberRoleSchema = z.enum([
  "MIEMBRO",
  "SUPERVISOR",
  "LIDER",
  "ANFITRION",
  "PASTOR",
  "TESORERO",
]);
const GenderSchema = z.enum(["MASCULINO", "FEMENINO"]);

// Main member validation schema for form data
export const memberSchema = z
  .object({
    // Optional fields
    id: z.string().optional(),
    // Required fields
    firstName: z
      .string()
      .min(1, "El nombre es requerido")
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "El nombre no puede exceder 50 caracteres")
      .regex(
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        "El nombre solo puede contener letras y espacios"
      ),

    lastName: z
      .string()
      .min(1, "El apellido es requerido")
      .min(2, "El apellido debe tener al menos 2 caracteres")
      .max(50, "El apellido no puede exceder 50 caracteres")
      .regex(
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        "El apellido solo puede contener letras y espacios"
      ),

    email: z
      .string()
      .min(1, "El email es requerido")
      .email({ message: "Formato de email inválido" })
      .max(100, "El email no puede exceder 100 caracteres")
      .toLowerCase(),

    role: MemberRoleSchema,

    gender: GenderSchema,

    // Optional fields with validation
    phone: z
      .string()
      .optional()
      .refine((val) => !val || /^[\d\s\-\+\(\)]+$/.test(val), {
        message: "Formato de teléfono inválido",
      }),

    age: z
      .union([z.string(), z.number()])
      .optional()
      .transform((val) => {
        if (val === "" || val === undefined || val === null) return undefined;
        const num = typeof val === "string" ? parseInt(val, 10) : val;
        return isNaN(num) ? undefined : num;
      })
      .refine((val) => val === undefined || (val >= 1 && val <= 120), {
        message: "La edad debe estar entre 1 y 120 años",
      }),

    // Address fields
    street: z
      .string()
      .max(100, "La dirección no puede exceder 100 caracteres")
      .optional(),

    city: z
      .string()
      .max(50, "La ciudad no puede exceder 50 caracteres")
      .optional(),

    state: z
      .string()
      .max(50, "El estado no puede exceder 50 caracteres")
      .optional(),

    zip: z
      .string()
      .max(20, "El código postal no puede exceder 20 caracteres")
      .optional(),

    country: z
      .string()
      .max(50, "El país no puede exceder 50 caracteres")
      .optional(),

    // Date fields
    birthDate: z
      .date()
      .max(new Date(), "La fecha de nacimiento no puede ser futura")
      .optional(),

    baptismDate: z
      .date()
      .optional(),

    // Church-specific fields
    ministries: z
      .string()
      .max(100, "Los ministerios no pueden exceder 100 caracteres")
      .optional(),

    notes: z
      .string()
      .max(500, "Las notas no pueden exceder 500 caracteres")
      .optional(),

    skills: z
      .array(
        z.string().max(50, "Cada habilidad no puede exceder 50 caracteres")
      )
      .max(10, "No se pueden agregar más de 10 habilidades")
      .optional(),

    // Password fields for new members
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(100, "La contraseña no puede exceder 100 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
      )
      .optional(),

    confirmPassword: z.string().optional(),

    // File upload field
    picture: z
      .array(z.instanceof(File))
      .max(1, "Solo se puede subir una imagen")
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
      message: "Las contraseñas no coinciden",
      path: ["confirmPassword"],
    }
  )
  .refine(
    (data) => {
      // Custom validation: baptism date should be after birth date
      if (data.birthDate && data.baptismDate) {
        return data.baptismDate > data.birthDate;
      }
      return true;
    },
    {
      message:
        "La fecha de bautismo debe ser posterior a la fecha de nacimiento",
      path: ["baptismDate"],
    }
  );

// Schema for updating members (all fields optional except id)
export const updateMemberSchema = memberSchema.partial().safeExtend({
  id: z.string().min(1, "ID es requerido"),
});

// Schema for member search/filtering
export const memberSearchSchema = z.object({
  search: z.string().optional(),
  role: MemberRoleSchema.optional(),
  gender: GenderSchema.optional(),
  ministries: z.string().optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

// Form-specific schema for react-hook-form (dates as strings, no transformations)
export const memberFormSchema = z
  .object({
    // Optional fields
    id: z.string().optional(),
    // Required fields
    firstName: z
      .string()
      .min(1, "El nombre es requerido")
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "El nombre no puede exceder 50 caracteres")
      .regex(
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        "El nombre solo puede contener letras y espacios"
      ),

    lastName: z
      .string()
      .min(1, "El apellido es requerido")
      .min(2, "El apellido debe tener al menos 2 caracteres")
      .max(50, "El apellido no puede exceder 50 caracteres")
      .regex(
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        "El apellido solo puede contener letras y espacios"
      ),

    email: z
      .string()
      .min(1, "El email es requerido")
      .email({ message: "Formato de email inválido" })
      .max(100, "El email no puede exceder 100 caracteres"),

    role: MemberRoleSchema,
    gender: GenderSchema,

    // Optional fields with validation
    phone: z
      .string()
      .optional()
      .refine((val) => !val || /^[\d\s\-\+\(\)]+$/.test(val), {
        message: "Formato de teléfono inválido",
      }),

    age: z
      .union([z.string(), z.number()])
      .optional()
      .transform((val) => {
        if (val === "" || val === undefined || val === null) return undefined;
        const num = typeof val === "string" ? parseInt(val, 10) : val;
        return isNaN(num) ? undefined : num;
      })
      .refine((val) => val === undefined || (val >= 1 && val <= 120), {
        message: "La edad debe estar entre 1 y 120 años",
      }),

    // Address fields
    street: z
      .string()
      .max(100, "La dirección no puede exceder 100 caracteres")
      .optional(),

    city: z
      .string()
      .max(50, "La ciudad no puede exceder 50 caracteres")
      .optional(),

    state: z
      .string()
      .max(50, "El estado no puede exceder 50 caracteres")
      .optional(),

    zip: z
      .string()
      .max(20, "El código postal no puede exceder 20 caracteres")
      .optional(),

    country: z
      .string()
      .max(50, "El país no puede exceder 50 caracteres")
      .optional(),

    // Date fields as strings for form inputs
    birthDate: z
      .string()
      .optional()
      .refine((val) => {
        if (!val) return true;
        const date = new Date(val);
        return !isNaN(date.getTime()) && date <= new Date();
      }, {
        message: "La fecha de nacimiento no puede ser futura",
      }),

    baptismDate: z
      .string()
      .optional()
      .refine((val) => {
        if (!val) return true;
        const date = new Date(val);
        return !isNaN(date.getTime());
      }, {
        message: "Formato de fecha inválido",
      }),

    // Church-specific fields
    ministries: z
      .string()
      .max(100, "Los ministerios no pueden exceder 100 caracteres")
      .optional(),

    notes: z
      .string()
      .max(500, "Las notas no pueden exceder 500 caracteres")
      .optional(),

    skills: z
      .array(
        z.string().max(50, "Cada habilidad no puede exceder 50 caracteres")
      )
      .max(10, "No se pueden agregar más de 10 habilidades")
      .optional(),

    // Password fields for new members
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(100, "La contraseña no puede exceder 100 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
      )
      .optional(),

    confirmPassword: z.string().optional(),

    // File upload field
    picture: z
      .array(z.instanceof(File))
      .max(1, "Solo se puede subir una imagen")
      .optional(),
      
    pictureUrl: z.string().optional(),
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
      message: "Las contraseñas no coinciden",
      path: ["confirmPassword"],
    }
  )
  .refine(
    (data) => {
      // Custom validation: baptism date should be after birth date
      if (data.birthDate && data.baptismDate) {
        const birthDate = new Date(data.birthDate);
        const baptismDate = new Date(data.baptismDate);
        return baptismDate > birthDate;
      }
      return true;
    },
    {
      message:
        "La fecha de bautismo debe ser posterior a la fecha de nacimiento",
      path: ["baptismDate"],
    }
  );

// Form-specific schema for client-side validation (dates as strings)
export const insertMemberFormSchema = memberSchema
  // Avoid overriding existing keys with safeExtend; omit then add back as strings
  .omit({ birthDate: true, baptismDate: true, age: true, gender: true })
  .safeExtend({
    birthDate: z
      .union([z.string(), z.date()])
      .optional()
      .transform((val) => {
        if (!val) return undefined;
        if (val instanceof Date) return val;
        const parsed = new Date(val);
        return isNaN(parsed.getTime()) ? undefined : parsed;
      })
      .refine((val) => !val || val <= new Date(), {
        message: "La fecha de nacimiento no puede ser futura",
      }),

    baptismDate: z
      .union([z.string(), z.date()])
      .optional()
      .transform((val) => {
        if (!val) return undefined;
        if (val instanceof Date) return val;
        const parsed = new Date(val);
        return isNaN(parsed.getTime()) ? undefined : parsed;
      })
      .refine((val) => !val || !isNaN(val.getTime()), {
        message: "Formato de fecha inválido",
      }),

    age: z
      .union([z.string(), z.number()])
      .optional()
      .transform((val) => {
        if (val === "" || val === undefined || val === null) return undefined;
        const num = typeof val === "string" ? parseInt(val, 10) : val;
        return isNaN(num) ? undefined : num;
      })
      .refine((val) => val === undefined || (val >= 1 && val <= 120), {
        message: "La edad debe estar entre 1 y 120 años",
      }),

    gender: z
      .union([z.string(), z.enum(["MASCULINO", "FEMENINO"])])
      .refine((val) => val !== "undefined" && val !== "" && val !== undefined, {
        message: "El género es requerido",
      })
      .transform((val) => val as "MASCULINO" | "FEMENINO")
      .pipe(GenderSchema),
  })
  // Ensure password confirmation matches when either field is provided
  .refine(
    (data) => {
      if (data.password || data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Las contraseñas no coinciden",
      path: ["confirmPassword"],
    }
  )
  .refine(
    (data) => {
      // Custom validation: baptism date should be after birth date
      if (data.birthDate && data.baptismDate) {
        // Both dates are already Date objects after transformation
        return data.baptismDate >= data.birthDate;
      }
      return true;
    },
    {
      message:
        "La fecha de bautismo debe ser posterior a la fecha de nacimiento",
      path: ["baptismDate"],
    }
  );

// Export types for use in components
export type MemberSchema = z.infer<typeof memberSchema>;
export type MemberFormSchema = z.infer<typeof memberFormSchema>;
export type InsertMemberFormSchema = z.infer<typeof insertMemberFormSchema>;
export type UpdateMemberSchema = z.infer<typeof updateMemberSchema>;
export type MemberSearchSchema = z.infer<typeof memberSearchSchema>;

// Type for form inputs (before transformation)
export type MemberFormInput = z.input<typeof memberFormSchema>;

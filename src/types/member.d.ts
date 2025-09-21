// Prisma-generated enums
export type MemberRole = 'MIEMBRO' | 'SUPERVISOR' | 'LIDER' | 'ANFITRION';
export type Gender = 'MASCULINO' | 'FEMENINO';

// Main Member interface matching Prisma schema
export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  age: number | null;

  // Address fields (flat structure from Prisma)
  street: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;

  // Important dates
  birthDate: Date | null;
  baptismDate: Date | null;

  // Church-specific fields
  role: MemberRole;
  gender: Gender;
  ministerio: string;

  // Additional fields
  pictureUrl: string | null;
  notes: string | null;
  skills: string[];

  // Authentication
  passwordHash: string | null;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Form-specific interface for creating/updating members
export interface MemberFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  age?: number;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  birthDate?: Date;
  baptismDate?: Date;
  role: MemberRole;
  gender: Gender;
  ministerio?: string;
  notes?: string;
  skills?: string[];
  password?: string;
  confirmPassword?: string;
  picture?: File[]; // For file uploads
}

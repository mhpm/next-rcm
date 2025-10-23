// Prisma-generated enums
import type { Member as PrismaMember, MemberRole, Gender, Ministry, MemberMinistry } from '@prisma/client';
export type Member = PrismaMember;
export type { MemberRole, Gender };

// Member with ministries relationship
export type MemberWithMinistries = Member & {
  ministries: (MemberMinistry & {
    ministry: Ministry;
  })[];
};

// Main Member interface matching Prisma schema
// `Member` ahora es un alias del tipo generado por Prisma

// Form-specific interface for creating/updating members
export interface MemberFormData {
  id?: string;
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
  notes?: string;
  skills?: string[];
  password?: string;
  confirmPassword?: string;
  picture?: File[]; // For file uploads
}

// Form values type for member forms (dates as strings for form inputs)
export interface MemberFormValues
  extends Omit<MemberFormData, 'birthDate' | 'baptismDate'> {
  birthDate?: string;
  baptismDate?: string;
}

// Type for creating a new member (without ID and system fields)
export type CreateMemberData = Omit<
  Member,
  'id' | 'createdAt' | 'updatedAt' | 'passwordHash'
>;

// Type for updating a member (all fields optional except system fields)
export type UpdateMemberData = Partial<
  Omit<Member, 'id' | 'createdAt' | 'updatedAt' | 'passwordHash'>
>;

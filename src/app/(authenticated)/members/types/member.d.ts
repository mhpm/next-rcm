// Prisma-generated enums
import type {
  Member as PrismaMember,
  MemberRole,
  Gender,
  Ministry,
  MemberMinistry,
} from "@/generated/prisma/client";
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
  email?: string | null;
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
  pictureUrl?: string | null; // URL of uploaded picture
  notes?: string;
  ministries?: string[]; // Array of ministry IDs
  password?: string;
  confirmPassword?: string;
  picture?: File[]; // For file uploads
}

// Form values type for member forms (dates as strings for form inputs)
export interface MemberFormValues
  extends Omit<MemberFormData, "birthDate" | "baptismDate"> {
  birthDate?: string;
  baptismDate?: string;
}

// Type for creating a new member (without ID and system fields)
export type CreateMemberData = Omit<
  Member,
  "id" | "createdAt" | "updatedAt" | "passwordHash"
>;

// Type for updating a member (all fields optional except system fields)
export type UpdateMemberData = Partial<
  Omit<Member, "id" | "createdAt" | "updatedAt" | "passwordHash">
>;

// Tipo para los datos transformados de la tabla
export type MemberTableData = Omit<
  MemberWithMinistries,
  | "gender"
  | "birthDate"
  | "baptismDate"
  | "createdAt"
  | "updatedAt"
  | "passwordHash"
  | "pictureUrl"
  | "age"
  | "street"
  | "city"
  | "state"
  | "zip"
  | "country"
  | "phone"
  | "church_id"
  | "ministries"
> & {
  birthDate: string;
  baptismDate: string;
  address: string;
  phone: string;
  ministries: string;
  raw_birthDate?: Date | null;
  raw_baptismDate?: Date | null;
};

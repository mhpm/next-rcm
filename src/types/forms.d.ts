import { Member, MemberFormData } from './member';

// Form values type for member forms (dates as strings for form inputs)
export interface MemberFormValues extends Omit<MemberFormData, 'birthDate' | 'baptismDate'> {
  birthDate?: string;
  baptismDate?: string;
}

// Type for creating a new member (without ID and system fields)
export type CreateMemberData = Omit<Member, 'id' | 'createdAt' | 'updatedAt' | 'passwordHash'>;

// Type for updating a member (all fields optional except system fields)
export type UpdateMemberData = Partial<Omit<Member, 'id' | 'createdAt' | 'updatedAt' | 'passwordHash'>>;

// Form state types
export interface FormState {
  isSubmitting: boolean;
  errors: Record<string, string>;
  isDirty: boolean;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Error types
export interface FormError {
  field: string;
  message: string;
}

export interface ValidationError {
  errors: FormError[];
  message: string;
}
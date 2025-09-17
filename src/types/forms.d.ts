import { Member } from './member';

// Form values type for member forms (dates as strings for form inputs)
export interface MemberFormValues extends Omit<Member, 'birthDate' | 'baptismDate' | 'id'> {
  birthDate?: string;
  baptismDate?: string;
}

// Type for creating a new member (without ID and form-specific fields)
export type CreateMemberData = Omit<Member, 'id' | 'password' | 'confirmPassword' | 'picture'>;

// Type for updating a member (all fields optional except ID and form-specific fields)
export type UpdateMemberData = Partial<Omit<Member, 'id' | 'password' | 'confirmPassword' | 'picture'>>;

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
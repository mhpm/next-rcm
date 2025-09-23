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

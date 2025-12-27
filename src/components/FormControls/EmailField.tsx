'use client';

import {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Check, X, Loader2 } from 'lucide-react';

type EmailFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  register: UseFormRegister<T>;
  rules?: RegisterOptions<T, Path<T>>;
  error?: string;
  validationStatus?: 'checking' | 'available' | 'taken' | 'error' | null;
};

export function EmailField<T extends FieldValues>({
  name,
  label,
  register,
  rules,
  error,
  validationStatus,
}: EmailFieldProps<T>) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={String(name)}>{label}</FieldLabel>
      <div className="relative">
        <Input
          id={String(name)}
          type="email"
          placeholder={label}
          autoComplete="off"
          aria-invalid={!!error}
          {...register(name, rules)}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {validationStatus === 'checking' && (
            <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
          )}
          {validationStatus === 'available' && (
            <Check className="h-4 w-4 text-green-600" />
          )}
          {validationStatus === 'taken' && <X className="h-4 w-4 text-red-600" />}
          {validationStatus === 'error' && <X className="h-4 w-4 text-amber-600" />}
        </div>
      </div>
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}

export default EmailField;

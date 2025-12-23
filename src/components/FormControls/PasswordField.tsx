'use client';

import React, { useState } from 'react';
import { FieldValues, Path, RegisterOptions, UseFormRegister } from 'react-hook-form';
import { RiEyeLine, RiEyeOffLine, RiKey2Fill } from 'react-icons/ri';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type PasswordFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  register: UseFormRegister<T>;
  rules?: RegisterOptions<T, Path<T>>;
  error?: string;
  placeholder?: string;
};

export function PasswordField<T extends FieldValues>({
  name,
  label,
  register,
  rules,
  error,
  placeholder,
}: PasswordFieldProps<T>) {
  const [show, setShow] = useState(false);

  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={String(name)}>{label}</FieldLabel>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-muted-foreground">
          <RiKey2Fill />
        </span>
        <Input
          id={String(name)}
          type={show ? 'text' : 'password'}
          placeholder={placeholder || label}
          className={cn('pl-9 pr-10')}
          autoComplete="new-password"
          aria-invalid={!!error}
          {...register(name, rules)}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-sm opacity-60 hover:opacity-100 flex items-center justify-center transition-opacity"
          onClick={() => setShow(!show)}
          aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {show ? <RiEyeOffLine /> : <RiEyeLine />}
        </button>
      </div>
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}

export default PasswordField;

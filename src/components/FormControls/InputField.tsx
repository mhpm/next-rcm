'use client';

import React from 'react';
import {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
  Control,
  Controller,
} from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';

type InputFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
  placeholder?: string;
  register?: UseFormRegister<T>;
  control?: Control<T>;
  rules?: RegisterOptions<T, Path<T>>;
  error?: string;
  className?: string;
  defaultValue?: string | number | readonly string[];
  readOnly?: boolean;
  disabled?: boolean;
  tabIndex?: number;
  startIcon?: React.ReactNode;
  step?: string;
  variant?: 'default' | 'filled';
} & React.InputHTMLAttributes<HTMLInputElement>;

export function InputField<T extends FieldValues>({
  name,
  label,
  type = 'text',
  placeholder,
  register,
  control,
  rules,
  error,
  className,
  defaultValue,
  readOnly,
  disabled,
  tabIndex,
  startIcon,
  step,
  variant = 'default',
  ...rest
}: InputFieldProps<T>) {
  const variantClasses =
    variant === 'filled'
      ? 'bg-muted/50 border-transparent focus:border-input focus:bg-background transition-colors'
      : '';

  if (control) {
    return (
      <Field className={className} data-invalid={!!error}>
        {label && <FieldLabel htmlFor={String(name)}>{label}</FieldLabel>}
        <div className="relative flex items-center">
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-muted-foreground">
              {startIcon}
            </div>
          )}
          <Controller
            control={control}
            name={name}
            rules={rules}
            defaultValue={defaultValue as any}
            render={({ field }) => (
              <Input
                id={String(name)}
                type={type}
                placeholder={placeholder || label}
                className={cn(startIcon ? 'pl-9' : '', variantClasses)}
                readOnly={readOnly}
                disabled={disabled}
                tabIndex={tabIndex}
                step={step}
                autoComplete="off"
                aria-invalid={!!error}
                {...field}
                {...rest}
                value={field.value ?? ''}
              />
            )}
          />
        </div>
        {error && <FieldError>{error}</FieldError>}
      </Field>
    );
  }

  return (
    <Field className={className} data-invalid={!!error}>
      {label && <FieldLabel htmlFor={String(name)}>{label}</FieldLabel>}
      <div className="relative flex items-center">
        {startIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-muted-foreground">
            {startIcon}
          </div>
        )}
        <Input
          id={String(name)}
          type={type}
          placeholder={placeholder || label}
          className={cn(startIcon ? 'pl-9' : '', variantClasses)}
          defaultValue={defaultValue}
          readOnly={readOnly}
          disabled={disabled}
          tabIndex={tabIndex}
          step={step}
          autoComplete="off"
          aria-invalid={!!error}
          {...(register ? register(name, rules) : {})}
          {...rest}
        />
      </div>
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}

export default InputField;

'use client';

import {
  FieldValues,
  Path,
  RegisterOptions,
  Control,
  Controller,
} from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type SelectFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  options: { value: string; label: string }[];
  control: Control<T>;
  rules?: RegisterOptions<T, Path<T>>;
  error?: string;
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  placeholder?: string;
  variant?: 'default' | 'filled';
};

export function SelectField<T extends FieldValues>({
  name,
  label,
  options,
  control,
  rules,
  error,
  className,
  defaultValue,
  disabled,
  placeholder = 'Seleccionar...',
  variant = 'default',
}: SelectFieldProps<T>) {
  const variantClasses =
    variant === 'filled'
      ? 'bg-muted/50 border-transparent focus:ring-2 focus:ring-ring focus:bg-background transition-colors'
      : '';

  return (
    <Field className={cn('w-full', className)} data-invalid={!!error}>
      {label && <FieldLabel htmlFor={String(name)}>{label}</FieldLabel>}
      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={defaultValue as any}
        render={({ field }) => {
          // Asegurarnos de que el valor sea siempre un string y manejar nulos/undefined
          const currentValue = field.value ?? '';
          const safeValue =
            currentValue === '' ? '__EMPTY__' : String(currentValue);

          return (
            <Select
              onValueChange={(val) => {
                const newValue = val === '__EMPTY__' ? '' : val;
                if (newValue !== currentValue) {
                  field.onChange(newValue);
                }
              }}
              value={safeValue}
              disabled={disabled}
            >
              <SelectTrigger
                id={String(name)}
                className={cn('w-full', variantClasses)}
                aria-invalid={!!error}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {/* Opción vacía si no existe en las opciones para evitar bucles de Radix */}
                {!options.some((opt) => opt.value === '') && (
                  <SelectItem value="__EMPTY__" className="hidden">
                    {placeholder}
                  </SelectItem>
                )}
                {options.map((opt) => {
                  const val = opt.value === '' ? '__EMPTY__' : opt.value;
                  return (
                    <SelectItem key={val} value={val}>
                      {opt.label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          );
        }}
      />
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}

export default SelectField;

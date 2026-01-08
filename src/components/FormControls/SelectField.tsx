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
}: SelectFieldProps<T>) {
  return (
    <Field className={cn('w-full', className)} data-invalid={!!error}>
      {label && (
        <FieldLabel
          className="mb-3 px-1 font-bold text-base text-slate-700 dark:text-slate-200"
          htmlFor={String(name)}
        >
          {label}
        </FieldLabel>
      )}
      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={defaultValue as any}
        render={({ field }) => (
          <Select
            onValueChange={(val) => {
              const v = val === '__EMPTY__' ? '' : val;
              field.onChange(v);
            }}
            value={field.value === '' ? '__EMPTY__' : (field.value as any)}
            disabled={disabled}
          >
            <SelectTrigger
              id={String(name)}
              className="w-full"
              aria-invalid={!!error}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <div className="max-h-50 overflow-y-auto">
                {options.map((opt) => {
                  const val = opt.value === '' ? '__EMPTY__' : opt.value;
                  return (
                    <SelectItem key={val} value={val}>
                      {opt.label}
                    </SelectItem>
                  );
                })}
              </div>
            </SelectContent>
          </Select>
        )}
      />
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}

export default SelectField;

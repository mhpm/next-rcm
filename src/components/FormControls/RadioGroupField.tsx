"use client";

import {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";

type RadioOption = { value: string; label: string };

type RadioGroupFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  options: RadioOption[];
  register: UseFormRegister<T>;
  rules?: RegisterOptions<T, Path<T>>;
  error?: string;
};

export function RadioGroupField<T extends FieldValues>({
  name,
  label,
  options,
  register,
  rules,
  error,
}: RadioGroupFieldProps<T>) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel>{label}</FieldLabel>
      <div className="flex items-center gap-4">
        {options.map((opt) => (
          <div key={opt.value} className="flex items-center gap-2">
            <input
              type="radio"
              value={opt.value}
              {...register(name, rules)}
              aria-invalid={!!error}
            />
            <Label className="cursor-pointer">{opt.label}</Label>
          </div>
        ))}
      </div>
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}

export default RadioGroupField;

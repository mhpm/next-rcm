'use client';

import React from 'react';
import {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';

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
    <fieldset>
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <div className="flex items-center mt-2 gap-4">
        {options.map((opt) => (
          <label key={opt.value} className="label cursor-pointer">
            <input type="radio" value={opt.value} className="radio" {...register(name, rules)} />
            <span className="label-text ml-2">{opt.label}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </fieldset>
  );
}

export default RadioGroupField;
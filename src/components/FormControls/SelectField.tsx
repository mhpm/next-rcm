'use client';

import React from 'react';
import {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';

type SelectFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  options: { value: string; label: string }[];
  register: UseFormRegister<T>;
  rules?: RegisterOptions<T, Path<T>>;
  error?: string;
  className?: string;
};

export function SelectField<T extends FieldValues>({
  name,
  label,
  options,
  register,
  rules,
  error,
  className = 'select select-bordered w-full',
}: SelectFieldProps<T>) {
  return (
    <fieldset>
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <select className={className} {...register(name, rules)}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </fieldset>
  );
}

export default SelectField;
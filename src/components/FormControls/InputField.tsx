"use client";

import React from "react";
import {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

type InputFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  placeholder?: string;
  register: UseFormRegister<T>;
  rules?: RegisterOptions<T, Path<T>>;
  error?: string;
  className?: string;
  defaultValue?: string | number | readonly string[];
  readOnly?: boolean;
  disabled?: boolean;
  tabIndex?: number;
};

export function InputField<T extends FieldValues>({
  name,
  label,
  type = "text",
  placeholder,
  register,
  rules,
  error,
  className = "input input-bordered w-full",
  defaultValue,
  readOnly,
  disabled,
  tabIndex,
}: InputFieldProps<T>) {
  return (
    <fieldset>
      <label className="label mb-2">
        <span className="label-text">{label}</span>
      </label>
      <input
        type={type}
        placeholder={placeholder || label}
        className={className}
        defaultValue={defaultValue}
        readOnly={readOnly}
        disabled={disabled}
        tabIndex={tabIndex}
        {...register(name, rules)}
      />
      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </fieldset>
  );
}

export default InputField;

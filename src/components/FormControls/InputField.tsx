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
  startIcon?: React.ReactNode;
  step?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

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
  startIcon,
  step,
  ...rest
}: InputFieldProps<T>) {
  return (
    <fieldset>
      <label className="label mb-2">
        <span className="label-text">{label}</span>
      </label>
      <div className="relative flex items-center">
        {startIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            {startIcon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder || label}
          className={`${className} ${startIcon ? "pl-8" : ""}`}
          defaultValue={defaultValue}
          readOnly={readOnly}
          disabled={disabled}
          tabIndex={tabIndex}
          step={step}
          autoComplete="off"
          {...register(name, rules)}
          {...rest}
        />
      </div>
      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </fieldset>
  );
}

export default InputField;

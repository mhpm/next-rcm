'use client';

import React from 'react';
import {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';
import { RiCheckLine, RiCloseLine, RiLoader4Line } from 'react-icons/ri';

// Email field with right-side validation icon support

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
  const baseClass = 'input input-bordered w-full pr-10';
  const inputClass =
    validationStatus === 'available'
      ? `${baseClass} input-success`
      : validationStatus === 'taken'
      ? `${baseClass} input-error`
      : validationStatus === 'error'
      ? `${baseClass} input-warning`
      : baseClass;

  return (
    <fieldset>
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <div className="relative">
        <input type="email" placeholder={label} className={inputClass} {...register(name, rules)} />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {validationStatus === 'checking' && (
            <RiLoader4Line className="w-5 h-5 text-gray-400 animate-spin" />
          )}
          {validationStatus === 'available' && <RiCheckLine className="w-5 h-5 text-success" />}
          {validationStatus === 'taken' && <RiCloseLine className="w-5 h-5 text-error" />}
          {validationStatus === 'error' && <RiCloseLine className="w-5 h-5 text-warning" />}
        </div>
      </div>
      {error && <p className="text-error text-sm mt-1">{error}</p>}
      {validationStatus === 'available' && !error && (
        <p className="text-success text-sm mt-1">✓ Correo disponible</p>
      )}
      {validationStatus === 'taken' && (
        <p className="text-error text-sm mt-1">✗ Este correo ya está en uso</p>
      )}
      {validationStatus === 'error' && (
        <p className="text-warning text-sm mt-1">⚠ Error al verificar disponibilidad</p>
      )}
    </fieldset>
  );
}

export default EmailField;
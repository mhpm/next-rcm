'use client';

import React, { useState } from 'react';
import { FieldValues, Path, RegisterOptions, UseFormRegister } from 'react-hook-form';
import { RiEyeLine, RiEyeOffLine, RiKey2Fill } from 'react-icons/ri';

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
    <fieldset>
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 z-10">
          <RiKey2Fill />
        </span>
        <input
          type={show ? 'text' : 'password'}
          placeholder={placeholder || label}
          className="input input-bordered w-full pl-10 pr-10"
          {...register(name, rules)}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3 z-10"
          onClick={() => setShow(!show)}
        >
          {show ? <RiEyeOffLine /> : <RiEyeLine />}
        </button>
      </div>
      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </fieldset>
  );
}

export default PasswordField;
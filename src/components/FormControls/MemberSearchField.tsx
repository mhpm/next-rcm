"use client";

import React from "react";
import {
  FieldValues,
  Path,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { AutocompleteField } from "./AutocompleteField";
import {
  getAllMembers,
  getMemberById,
} from "@/app/members/actions/members.actions";
import { Member } from "@/types";

type MemberSearchFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder?: string;
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  watch: UseFormWatch<T>;
  error?: string;
  minChars?: number; // default: 2
};

export function MemberSearchField<T extends FieldValues>({
  name,
  label,
  placeholder,
  register,
  setValue,
  watch,
  error,
  minChars = 2,
}: MemberSearchFieldProps<T>) {
  return (
    <AutocompleteField<T, Member>
      name={name}
      label={label}
      placeholder={placeholder || "Buscar miembros por nombre..."}
      register={register}
      setValue={setValue}
      watch={watch}
      error={error}
      minChars={minChars}
      search={async (term) => {
        const res = await getAllMembers({ search: term, limit: 10 });
        return res.members;
      }}
      resolveById={async (id) => {
        try {
          const member = await getMemberById(id);
          return member ?? null;
        } catch (e) {
          console.error("Error fetching member by ID:", e);
          return null;
        }
      }}
      getItemId={(m) => m.id}
      getItemLabel={(m) => `${m.firstName} ${m.lastName}`}
      renderItem={(m) => (
        <>
          {m.firstName} {m.lastName}{" "}
        </>
      )}
    />
  );
}

export default MemberSearchField;

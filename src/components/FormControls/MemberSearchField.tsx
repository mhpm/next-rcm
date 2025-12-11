"use client";

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
} from "@/app/(authenticated)/members/actions/members.actions";
import { MemberWithMinistries } from "@/types";

type MemberSearchFieldProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  placeholder?: string;
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  watch: UseFormWatch<T>;
  error?: string;
  minChars?: number; // default: 2
  search?: (term: string) => Promise<MemberWithMinistries[]>;
  resolveById?: (id: string) => Promise<MemberWithMinistries | null>;
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
  search,
  resolveById,
}: MemberSearchFieldProps<T>) {
  return (
    <AutocompleteField<T, MemberWithMinistries>
      name={name}
      label={label}
      placeholder={placeholder || "Buscar miembros por nombre..."}
      register={register}
      setValue={setValue}
      watch={watch}
      error={error}
      minChars={minChars}
      search={
        search ||
        (async (term) => {
          const res = await getAllMembers({ search: term, limit: 10 });
          return res.members;
        })
      }
      resolveById={
        resolveById ||
        (async (id) => {
          try {
            const member = await getMemberById(id);
            console.log("🚀 ~ MemberSearchField ~ member:", member);
            return member ?? null;
          } catch (e) {
            console.error("Error fetching member by ID:", e);
            return null;
          }
        })
      }
      getItemId={(m) => m.id}
      getItemLabel={(m) => `${m.firstName} ${m.lastName}`}
      renderItem={(m) => (
        <>
          {m.firstName} {m.lastName}{" "}
          <span className="text-sm font-semibold text-gray-700">
            {m.ministries && m.ministries.length > 0
              ? m.ministries
                  .map((mm: MemberWithMinistries) => mm.ministry?.name)
                  .filter(Boolean)
                  .join(", ")
              : "No pertenece a ningún ministerio"}
          </span>
        </>
      )}
    />
  );
}

export default MemberSearchField;

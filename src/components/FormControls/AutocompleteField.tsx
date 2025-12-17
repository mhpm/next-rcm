"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  FieldValues,
  Path,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  FieldPathValue,
} from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";

type AutocompleteFieldProps<TForm extends FieldValues, TItem> = {
  name: Path<TForm>;
  label: string;
  placeholder?: string;
  register: UseFormRegister<TForm>;
  setValue: UseFormSetValue<TForm>;
  watch: UseFormWatch<TForm>;
  error?: string;
  minChars?: number; // default 2
  // Search for items given a term
  search: (term: string) => Promise<TItem[]>;
  // Resolve an item by its id (to show label when editing)
  resolveById?: (id: string) => Promise<TItem | null>;
  // Extractors
  getItemId: (item: TItem) => string;
  getItemLabel: (item: TItem) => string;
  // Optional custom renderer for dropdown items
  renderItem?: (item: TItem) => React.ReactNode;
};

export function AutocompleteField<TForm extends FieldValues, TItem>({
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
  getItemId,
  getItemLabel,
  renderItem,
}: AutocompleteFieldProps<TForm, TItem>) {
  const [searchText, setSearchText] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [hasTyped, setHasTyped] = useState<boolean>(false);
  const debouncedSearch = useDebounce(searchText, 300);
  const dropdownOpen =
    isFocused && hasTyped && debouncedSearch.length >= minChars;

  const inputRef = useRef<HTMLInputElement>(null);

  const selectedId = (watch(name) as string | null) || "";

  // Resolve the selected item label on edit
  const { data: selectedItem } = useQuery({
    queryKey: ["autocomplete", String(name), "resolve", selectedId],
    queryFn: async () => {
      if (!resolveById || !selectedId) return null;
      return await resolveById(selectedId);
    },
    enabled: !!resolveById && !!selectedId,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (selectedId && selectedItem) {
      setSearchText(getItemLabel(selectedItem));
      setHasTyped(false);
    } else if (!selectedId) {
      setSearchText("");
    }
  }, [selectedId, selectedItem, getItemLabel]);

  // Search query
  const { data: results, isLoading } = useQuery({
    queryKey: ["autocomplete", String(name), "search", debouncedSearch],
    queryFn: async () => {
      const items = await search(debouncedSearch);
      return items;
    },
    enabled: dropdownOpen,
    staleTime: 60_000,
  });

  return (
    <fieldset>
      <label className="label">
        <span className="label-text">{label}</span>
      </label>

      {/* Hidden value bound to RHF */}
      <input type="hidden" {...register(name)} />

      <div className={`dropdown w-full ${dropdownOpen ? "dropdown-open" : ""}`}>
        <div className="relative">
          <input
            type="text"
            className="input input-bordered w-full pr-10"
            placeholder={placeholder || label}
            value={searchText}
            autoComplete="off"
            onChange={(e) => {
              setSearchText(e.target.value);
              setHasTyped(true);
              if (e.target.value === "") {
                setValue(name, null as FieldPathValue<TForm, Path<TForm>>);
              }
            }}
            onFocus={() => {
              setIsFocused(true);
              setHasTyped(false);
            }}
            onBlur={() =>
              setTimeout(() => {
                setIsFocused(false);
                setHasTyped(false);
              }, 150)
            }
            ref={inputRef}
          />

          {selectedId && searchText && (
            <button
              type="button"
              aria-label="Limpiar selección"
              className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs z-10"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setValue(name, null as FieldPathValue<TForm, Path<TForm>>);
                setSearchText("");
                setHasTyped(false);
                inputRef.current?.focus();
              }}
            >
              ✕
            </button>
          )}
        </div>

        {dropdownOpen && (
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full mt-2"
          >
            {isLoading ? (
              <li>
                <span>Buscando...</span>
              </li>
            ) : results && results.length > 0 ? (
              results.map((item: TItem) => (
                <li key={getItemId(item)}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setValue(
                        name,
                        getItemId(item) as FieldPathValue<TForm, Path<TForm>>
                      );
                      setSearchText(getItemLabel(item));
                      setIsFocused(false);
                      setHasTyped(false);
                    }}
                  >
                    {renderItem ? renderItem(item) : getItemLabel(item)}
                  </button>
                </li>
              ))
            ) : (
              <li>
                <span>Sin resultados</span>
              </li>
            )}
          </ul>
        )}
      </div>

      {error && <p className="text-error text-sm mt-1">{error}</p>}
    </fieldset>
  );
}

export default AutocompleteField;

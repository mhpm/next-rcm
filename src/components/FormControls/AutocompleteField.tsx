'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  FieldValues,
  Path,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  FieldPathValue,
} from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Loader2, X } from 'lucide-react';

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
  const [searchText, setSearchText] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [hasTyped, setHasTyped] = useState<boolean>(false);
  const debouncedSearch = useDebounce(searchText, 300);
  const dropdownOpen =
    isFocused && hasTyped && debouncedSearch.length >= minChars;

  const inputRef = useRef<HTMLInputElement>(null);

  const selectedId = (watch(name) as string | null) || '';

  // Resolve the selected item label on edit
  const { data: selectedItem } = useQuery({
    queryKey: ['autocomplete', String(name), 'resolve', selectedId],
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
      setSearchText('');
    }
  }, [selectedId, selectedItem, getItemLabel]);

  // Search query
  const { data: results, isLoading } = useQuery({
    queryKey: ['autocomplete', String(name), 'search', debouncedSearch],
    queryFn: async () => {
      const items = await search(debouncedSearch);
      return items;
    },
    enabled: dropdownOpen,
    staleTime: 60_000,
  });

  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={String(name)}>{label}</FieldLabel>

      {/* Hidden value bound to RHF */}
      <input type="hidden" {...register(name)} />

      <div className="relative w-full">
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            className={cn(
              'pr-10',
              error && 'border-destructive focus-visible:ring-destructive'
            )}
            placeholder={placeholder || label}
            value={searchText}
            autoComplete="off"
            aria-invalid={!!error}
            onChange={(e) => {
              setSearchText(e.target.value);
              setHasTyped(true);
              if (e.target.value === '') {
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
          />

          {selectedId && searchText && (
            <button
              type="button"
              aria-label="Limpiar selección"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-sm opacity-50 hover:opacity-100 flex items-center justify-center transition-opacity"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setValue(name, null as FieldPathValue<TForm, Path<TForm>>);
                setSearchText('');
                setHasTyped(false);
                inputRef.current?.focus();
              }}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {dropdownOpen && (
          <div className="absolute z-50 w-full mt-1 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
            <ul className="max-h-60 overflow-y-auto p-1">
              {isLoading ? (
                <li className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none justify-center text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Buscando...
                </li>
              ) : results && results.length > 0 ? (
                results.map((item: TItem) => (
                  <li key={getItemId(item)}>
                    <button
                      type="button"
                      className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-left"
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
                <li className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none text-muted-foreground justify-center">
                  Sin resultados
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}

export default AutocompleteField;

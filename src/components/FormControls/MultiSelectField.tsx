'use client';

import { useState, useRef, useEffect } from 'react';
import { FieldValues, Path } from 'react-hook-form';
import { RiArrowDownSLine, RiCloseLine } from 'react-icons/ri';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check } from 'lucide-react';

import { Field, FieldLabel, FieldError } from '@/components/ui/field';

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectFieldProps<T extends FieldValues> {
  name?: Path<T>; // Made optional since we don't use it internally
  label: string;
  options: MultiSelectOption[];
  value?: string[];
  onChange: (values: string[]) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  isLoading?: boolean;
}

export function MultiSelectField<T extends FieldValues>({
  label,
  options,
  value = [],
  onChange,
  error,
  placeholder = 'Seleccionar...',
  disabled = false,
  required = false,
  isLoading = false,
}: Omit<MultiSelectFieldProps<T>, 'name'>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected options for display
  const selectedOptions = options.filter((option) =>
    value.includes(option.value)
  );

  // Handle option selection
  const handleOptionToggle = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  // Handle removing a selected option
  const handleRemoveOption = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValue = value.filter((v) => v !== optionValue);
    onChange(newValue);
  };

  // Handle clear all
  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <Field data-invalid={!!error}>
      <FieldLabel>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </FieldLabel>

      <div className="relative" ref={dropdownRef}>
        {/* Main input display */}
        <div
          className={cn(
            'flex w-full min-h-11 h-auto cursor-pointer flex-wrap items-center gap-2 rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background transition-all hover:bg-accent/50 hover:border-primary/50 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
            error && 'border-destructive focus-within:ring-destructive',
            disabled && 'cursor-not-allowed opacity-50 bg-muted'
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          {/* Selected items */}
          {selectedOptions.length > 0 ? (
            <div className="flex flex-wrap gap-1 flex-1">
              {selectedOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant="secondary"
                  className="rounded-md px-2 py-0.5 gap-1 hover:bg-secondary/80 text-xs font-medium border-none bg-primary/10 text-primary"
                >
                  {option.label}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveOption(option.value, e)}
                      className="ml-0.5 rounded-full outline-none hover:bg-primary/20 p-0.5 transition-colors"
                    >
                      <RiCloseLine className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground flex-1">{placeholder}</span>
          )}

          {/* Controls */}
          <div className="flex items-center gap-2 ml-auto">
            {selectedOptions.length > 0 && !disabled && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-muted-foreground hover:text-destructive p-1 rounded-full hover:bg-destructive/10 transition-colors"
              >
                <RiCloseLine className="w-4 h-4" />
              </button>
            )}
            <div className="w-px h-4 bg-border mx-1" />
            <RiArrowDownSLine
              className={cn(
                'w-4 h-4 text-muted-foreground transition-transform duration-300',
                isOpen && 'rotate-180 text-primary'
              )}
            />
          </div>
        </div>

        {/* Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-2 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 overflow-hidden backdrop-blur-sm bg-popover/95">
            {/* Search input */}
            <div className="p-2 border-b bg-muted/30">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Buscar opciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-all placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-transparent"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            {/* Options list */}
            <div className="max-h-60 overflow-y-auto p-1 space-y-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
                  Cargando...
                </div>
              ) : filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const isSelected = value.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      className={cn(
                        'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none transition-colors border-none bg-transparent text-left',
                        isSelected
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-accent hover:text-accent-foreground'
                      )}
                      onClick={() => handleOptionToggle(option.value)}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <div
                          className={cn(
                            'h-4 w-4 rounded border-2 flex items-center justify-center transition-colors',
                            isSelected
                              ? 'bg-primary border-primary'
                              : 'border-input'
                          )}
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 text-primary-foreground" />
                          )}
                        </div>
                        <span className="flex-1 truncate">{option.label}</span>
                        {isSelected && <Check className="w-4 h-4 ml-auto" />}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  No se encontraron opciones
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}

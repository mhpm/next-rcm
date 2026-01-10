'use client';

import { useState, useRef, useEffect } from 'react';
import { RiArrowDownSLine, RiCloseLine } from 'react-icons/ri';
import { cn } from '@/lib/utils';
import { Loader2, Check, Search } from 'lucide-react';

import { FieldError } from '@/components/ui/field';

export interface SelectOption {
  value: string;
  label: string;
}

interface SearchableSelectFieldProps {
  label: string;
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  isLoading?: boolean;
  variant?: 'default' | 'filled';
}

export function SearchableSelectField({
  label,
  options,
  value,
  onChange,
  error,
  placeholder = 'Seleccionar...',
  disabled = false,
  required = false,
  isLoading = false,
  variant = 'default',
}: SearchableSelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const variantClasses =
    variant === 'filled'
      ? 'bg-muted/50 border-transparent focus-within:bg-background'
      : 'bg-background';

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected option for display
  const selectedOption = options.find((option) => option.value === value);

  // Handle option selection
  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  // Handle clear selection
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
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
    <div className={cn('relative', isOpen && 'z-50')} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-bold text-foreground mb-2 px-1">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Main input display */}
        <div
          className={cn(
            'flex w-full min-h-12 sm:min-h-11 h-auto cursor-pointer items-center gap-2 rounded-md border border-input px-3 py-2 text-lg sm:text-sm ring-offset-background transition-all hover:bg-accent hover:border-primary/50 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
            variantClasses,
            error && 'border-destructive focus-within:ring-destructive',
            disabled && 'cursor-not-allowed opacity-50 bg-muted'
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          {selectedOption ? (
            <span className="flex-1 font-medium text-foreground truncate">
              {selectedOption.label}
            </span>
          ) : (
            <span className="text-muted-foreground flex-1">{placeholder}</span>
          )}

          {/* Controls */}
          <div className="flex items-center gap-2 ml-auto">
            {value && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="text-muted-foreground hover:text-destructive p-1 rounded-full hover:bg-destructive/10 transition-colors"
              >
                <RiCloseLine className="w-5 h-5 sm:w-4 sm:h-4" />
              </button>
            )}
            <div className="w-px h-5 sm:h-4 bg-border mx-1" />
            <RiArrowDownSLine
              className={cn(
                'w-5 h-5 sm:w-4 sm:h-4 text-muted-foreground transition-transform duration-300',
                isOpen && 'rotate-180 text-primary'
              )}
            />
          </div>
        </div>

        {/* Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute z-[100] w-full mt-2 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 overflow-hidden backdrop-blur-sm bg-popover/95">
            {/* Search input */}
            <div className="p-2 border-b bg-muted/30">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-4 sm:h-4 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex h-11 sm:h-9 w-full rounded-md border border-input bg-background pl-10 pr-3 py-1 text-lg sm:text-sm shadow-sm transition-all placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-transparent"
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
                  const isSelected = value === option.value;
                  return (
                    <div
                      key={option.value}
                      className={cn(
                        'relative flex w-full cursor-pointer select-none items-center rounded-sm py-3 sm:py-1.5 px-3 sm:px-2 text-lg sm:text-sm outline-none transition-colors',
                        isSelected
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'hover:bg-accent hover:text-accent-foreground'
                      )}
                      onClick={() => handleSelect(option.value)}
                    >
                      <span className="flex-1 truncate">{option.label}</span>
                      {isSelected && (
                        <Check className="w-5 h-5 sm:w-4 sm:h-4 ml-auto text-primary" />
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  No se encontraron resultados
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}

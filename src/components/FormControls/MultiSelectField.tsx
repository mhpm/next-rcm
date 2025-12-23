"use client";

import React, { useState, useRef, useEffect } from "react";
import { FieldValues, Path } from "react-hook-form";
import { RiArrowDownSLine, RiCloseLine } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

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
  placeholder = "Seleccionar...",
  disabled = false,
  required = false,
  isLoading = false,
}: Omit<MultiSelectFieldProps<T>, "name">) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="w-full space-y-2">
      <label
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          error && "text-destructive"
        )}
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>

      <div className="relative" ref={dropdownRef}>
        {/* Main input display */}
        <div
          className={cn(
            "flex w-full min-h-10 h-auto cursor-pointer flex-wrap items-center gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors hover:bg-accent/50",
            error && "border-destructive focus-visible:ring-destructive",
            disabled && "cursor-not-allowed opacity-50 bg-muted"
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
                  className="rounded-full gap-1 hover:bg-secondary/80"
                >
                  {option.label}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveOption(option.value, e)}
                      className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      <RiCloseLine className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground flex-1">{placeholder}</span>
          )}

          {/* Controls */}
          <div className="flex items-center gap-1">
            {selectedOptions.length > 0 && !disabled && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-muted-foreground hover:text-foreground p-0.5 rounded-full hover:bg-muted"
              >
                <RiCloseLine className="w-4 h-4" />
              </button>
            )}
            <RiArrowDownSLine
              className={cn(
                "w-4 h-4 text-muted-foreground transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </div>
        </div>

        {/* Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
            {/* Search input */}
            <div className="p-2 border-b">
              <input
                ref={inputRef}
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Options list */}
            <div className="max-h-60 overflow-y-auto p-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cargando...
                </div>
              ) : filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const isSelected = value.includes(option.value);
                  return (
                    <div
                      key={option.value}
                      className={cn(
                        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                        isSelected && "bg-accent/50"
                      )}
                      onClick={() => handleOptionToggle(option.value)}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => {}} // Controlled by parent click
                          className="pointer-events-none" // Let parent div handle click
                        />
                        <span className="flex-1 truncate">{option.label}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-2 text-center text-sm text-muted-foreground">
                  No se encontraron opciones
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}

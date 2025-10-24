"use client";

import React, { useState, useRef, useEffect } from 'react';
import { FieldValues, Path } from 'react-hook-form';
import { RiArrowDownSLine, RiCloseLine } from 'react-icons/ri';

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
}: Omit<MultiSelectFieldProps<T>, 'name'>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected options for display
  const selectedOptions = options.filter(option => value.includes(option.value));

  // Handle option selection
  const handleOptionToggle = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  // Handle removing a selected option
  const handleRemoveOption = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValue = value.filter(v => v !== optionValue);
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
    <div className="form-control w-full">
      <label className="label">
        <span className="label-text">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </span>
      </label>
      
      <div className="relative" ref={dropdownRef}>
        {/* Main input display */}
        <div
          className={`
            input input-bordered w-full min-h-[3rem] h-auto cursor-pointer
            flex flex-wrap items-center gap-1 p-2
            ${error ? 'input-error' : ''}
            ${disabled ? 'input-disabled' : ''}
          `}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          {/* Selected items */}
          {selectedOptions.length > 0 ? (
            <div className="flex flex-wrap gap-1 flex-1">
              {selectedOptions.map((option) => (
                <span
                  key={option.value}
                  className="badge badge-primary gap-1 text-xs"
                >
                  {option.label}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveOption(option.value, e)}
                      className="btn btn-ghost btn-xs p-0 min-h-0 h-4 w-4"
                    >
                      <RiCloseLine className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-base-content/50 flex-1">{placeholder}</span>
          )}
          
          {/* Controls */}
          <div className="flex items-center gap-1">
            {selectedOptions.length > 0 && !disabled && (
              <button
                type="button"
                onClick={handleClearAll}
                className="btn btn-ghost btn-xs p-0 min-h-0 h-5 w-5"
              >
                <RiCloseLine className="w-4 h-4" />
              </button>
            )}
            <RiArrowDownSLine 
              className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            />
          </div>
        </div>

        {/* Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
            {/* Search input */}
            <div className="p-2 border-b border-base-300">
              <input
                ref={inputRef}
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-sm input-bordered w-full"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Options list */}
            <div className="max-h-48 overflow-y-auto">
              {isLoading ? (
                <div className="px-3 py-2 text-base-content/50 text-center">
                  <span className="loading loading-spinner loading-sm"></span>
                  <span className="ml-2">Cargando...</span>
                </div>
              ) : filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const isSelected = value.includes(option.value);
                  return (
                    <div
                      key={option.value}
                      className={`
                        px-3 py-2 cursor-pointer hover:bg-base-200 flex items-center gap-2
                        ${isSelected ? 'bg-primary/10 text-primary' : ''}
                      `}
                      onClick={() => handleOptionToggle(option.value)}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // Controlled by parent click
                        className="checkbox checkbox-sm checkbox-primary"
                      />
                      <span className="flex-1">{option.label}</span>
                    </div>
                  );
                })
              ) : (
                <div className="px-3 py-2 text-base-content/50 text-center">
                  No se encontraron opciones
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}
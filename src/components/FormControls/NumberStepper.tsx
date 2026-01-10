'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

import { Field, FieldLabel, FieldError } from '@/components/ui/field';

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
}

export function NumberStepper({
  value = 0,
  onChange,
  min = 0,
  max,
  step = 1,
  label,
  className,
  error,
  disabled,
}: NumberStepperProps) {
  const handleDecrement = (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    const newValue = value - step;
    if (min !== undefined && newValue < min) return;
    onChange(newValue);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    const newValue = value + step;
    if (max !== undefined && newValue > max) return;
    onChange(newValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const newValue = parseInt(e.target.value);
    if (isNaN(newValue)) {
      onChange(0);
      return;
    }
    if (min !== undefined && newValue < min) return;
    if (max !== undefined && newValue > max) return;
    onChange(newValue);
  };

  return (
    <Field className={className} data-invalid={!!error}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div className="flex items-center justify-between bg-card border rounded-md p-1 shadow-sm transition-all duration-200 group border-border h-11">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-md bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors border border-border"
          onClick={handleDecrement}
          disabled={disabled || (min !== undefined && value <= min)}
        >
          <Minus className="h-4 w-4" />
        </Button>

        <div className="flex-1 flex justify-center">
          <input
            type="number"
            value={value}
            onChange={handleChange}
            disabled={disabled}
            className="w-full text-center text-sm font-semibold bg-transparent border-none focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-foreground"
          />
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-md bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary transition-colors border border-primary/20"
          onClick={handleIncrement}
          disabled={disabled || (max !== undefined && value >= max)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}

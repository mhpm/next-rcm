'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
  error?: string;
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
}: NumberStepperProps) {
  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    const newValue = value - step;
    if (min !== undefined && newValue < min) return;
    onChange(newValue);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    const newValue = value + step;
    if (max !== undefined && newValue > max) return;
    onChange(newValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className={cn('flex flex-col gap-2 w-full', className)}>
      {label && (
        <label
          className={cn(
            'text-base font-bold text-slate-700 dark:text-slate-200 mb-3 px-1 block',
            error && 'text-destructive'
          )}
        >
          {label}
        </label>
      )}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 border-2 rounded-3xl p-3 shadow-sm hover:shadow-md transition-all duration-200 group border-slate-200 dark:border-slate-800 h-24 sm:h-28">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-colors border-2 border-slate-200 dark:border-slate-700 shadow-sm"
          onClick={handleDecrement}
          disabled={min !== undefined && value <= min}
        >
          <Minus className="h-7 w-7" />
        </Button>

        <div className="flex-1 flex justify-center">
          <input
            type="number"
            value={value}
            onChange={handleChange}
            className="w-full text-center text-4xl sm:text-5xl font-black bg-transparent border-none focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-slate-900 dark:text-white"
          />
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/60 hover:text-blue-800 dark:hover:text-blue-200 transition-colors border-2 border-blue-200 dark:border-blue-700 shadow-sm"
          onClick={handleIncrement}
          disabled={max !== undefined && value >= max}
        >
          <Plus className="h-7 w-7" />
        </Button>
      </div>
      {error && <span className="text-xs text-destructive mt-1">{error}</span>}
    </div>
  );
}

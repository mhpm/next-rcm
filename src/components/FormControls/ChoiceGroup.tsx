'use client';

import { cn } from '@/lib/utils';

interface ChoiceGroupProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
}

export function ChoiceGroup({
  options,
  value,
  onChange,
  label,
  className,
  error,
  disabled,
}: ChoiceGroupProps) {
  return (
    <div className={cn('flex flex-col gap-3 w-full', className)}>
      {label && (
        <label
          className={cn(
            'text-base font-bold text-foreground mb-3 px-1 block',
            error && 'text-destructive'
          )}
        >
          {label}
        </label>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              onClick={() => onChange(option.value)}
              className={cn(
                'flex items-center justify-center px-6 py-4 rounded-2xl border-2 transition-all duration-200 text-lg font-bold shadow-sm',
                isSelected
                  ? 'bg-primary border-primary text-primary-foreground shadow-primary/20'
                  : 'bg-background border-input text-muted-foreground hover:border-primary/50 hover:bg-accent hover:text-accent-foreground',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {error && (
        <span className="text-base font-bold text-destructive mt-2 px-1 block">
          {error}
        </span>
      )}
    </div>
  );
}

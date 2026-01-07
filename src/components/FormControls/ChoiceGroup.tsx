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
            'text-base font-bold text-slate-700 dark:text-slate-200 mb-3 px-1 block',
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
                  ? 'bg-blue-600 border-blue-600 text-white shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800',
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

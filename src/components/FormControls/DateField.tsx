'use client';

import { useState, useEffect } from 'react';
import {
  Control,
  FieldValues,
  Path,
  RegisterOptions,
  useController,
} from 'react-hook-form';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  setMonth,
  setYear,
  getYear,
  getMonth,
} from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';

interface DateFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  control: Control<T>;
  rules?: RegisterOptions<T, Path<T>>;
  error?: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  defaultToNow?: boolean;
}

export function DateField<T extends FieldValues>({
  name,
  label,
  control,
  rules,
  error: errorProp,
  className,
  placeholder = 'Seleccionar fecha',
  disabled,
  defaultToNow = false,
}: DateFieldProps<T>) {
  const { field, fieldState } = useController({
    name,
    control,
    rules,
  });

  const error = errorProp || fieldState.error?.message;

  useEffect(() => {
    if (defaultToNow && !field.value) {
      field.onChange(new Date().toISOString());
    }
  }, [defaultToNow, field.value, field]);

  return (
    <Field className={className} data-invalid={!!error}>
      {label && (
        <FieldLabel className="mb-3 px-1 font-bold text-base block text-foreground">
          {label}
        </FieldLabel>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-full h-14 justify-start text-left font-bold text-lg rounded-2xl border-input bg-background hover:bg-accent hover:text-accent-foreground transition-all px-4',
              !field.value && 'text-muted-foreground',
              error && 'border-destructive ring-destructive/20',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-3 h-5 w-5 text-muted-foreground" />
            {field.value ? (
              format(new Date(field.value), 'PPP', { locale: es })
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-(--radix-popover-trigger-width) p-0 rounded-2xl shadow-2xl border-2"
          align="start"
        >
          <Calendar
            selected={field.value ? new Date(field.value) : undefined}
            onSelect={(date) => {
              field.onChange(date?.toISOString());
            }}
          />
        </PopoverContent>
      </Popover>
      {error && <FieldError className="mt-2">{error}</FieldError>}
    </Field>
  );
}

function Calendar({
  selected,
  onSelect,
}: {
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
}) {
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 }),
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const years = Array.from(
    { length: 10 },
    (_, i) => getYear(new Date()) - 5 + i
  );
  const months = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="p-4 bg-background dark:bg-slate-900 w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <select
            value={getMonth(currentMonth)}
            onChange={(e) =>
              setCurrentMonth(setMonth(currentMonth, parseInt(e.target.value)))
            }
            className="bg-transparent font-black text-lg cursor-pointer hover:text-primary transition-colors focus:outline-none"
          >
            {months.map((m) => (
              <option
                key={m}
                value={m}
                className="bg-background text-slate-900 dark:text-slate-100"
              >
                {format(new Date(2000, m, 1), 'MMMM', { locale: es })}
              </option>
            ))}
          </select>
          <select
            value={getYear(currentMonth)}
            onChange={(e) =>
              setCurrentMonth(setYear(currentMonth, parseInt(e.target.value)))
            }
            className="bg-transparent font-black text-lg cursor-pointer hover:text-primary transition-colors focus:outline-none text-slate-900 dark:text-slate-100"
          >
            {years.map((y) => (
              <option
                key={y}
                value={y}
                className="bg-background text-slate-900 dark:text-slate-100"
              >
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevMonth}
            className="h-9 w-9 rounded-lg"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextMonth}
            className="h-9 w-9 rounded-lg"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-3">
        {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-black uppercase text-slate-500 dark:text-slate-400 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          const isSelected = selected && isSameDay(day, selected);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());

          return (
            <button
              key={i}
              onClick={() => onSelect(day)}
              className={cn(
                'h-10 w-full flex items-center justify-center rounded-xl text-base transition-all relative text-slate-700 dark:text-slate-200',
                !isCurrentMonth && 'text-slate-300 dark:text-slate-600',
                isSelected
                  ? 'bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/30'
                  : 'hover:bg-accent',
                isToday &&
                  !isSelected &&
                  "text-primary font-bold after:content-[''] after:absolute after:bottom-1 after:w-1 after:h-1 after:bg-primary after:rounded-full"
              )}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t flex justify-between items-center">
        <Button
          variant="ghost"
          size="sm"
          className="text-sm font-bold text-muted-foreground hover:text-primary"
          onClick={() => onSelect(undefined)}
        >
          Limpiar
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-sm font-bold text-primary"
          onClick={() => {
            const today = new Date();
            setCurrentMonth(today);
            onSelect(today);
          }}
        >
          Hoy
        </Button>
      </div>
    </div>
  );
}

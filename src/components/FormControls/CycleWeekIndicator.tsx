'use client';

import { useMemo } from 'react';
import { calculateCycleState, getCycleStateForWeek, VerbOption } from '@/lib/cycleUtils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, Clock, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface CycleWeekIndicatorProps {
  label?: string | null;
  startDate?: string | Date | null;
  className?: string;
  verbs?: VerbOption[];
  reportDate?: string | Date | null;
  onStartDateChange?: (date: string) => void;
  forcedWeek?: number;
}

export function CycleWeekIndicator({
  label,
  startDate,
  className,
  verbs,
  reportDate,
  onStartDateChange,
  forcedWeek,
}: CycleWeekIndicatorProps) {
  const state = useMemo(() => {
    if (forcedWeek) {
      return getCycleStateForWeek(forcedWeek, startDate, verbs);
    }
    return calculateCycleState(startDate, verbs, reportDate);
  }, [startDate, verbs, reportDate, forcedWeek]);

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <div className="flex items-center justify-between text-muted-foreground font-medium text-xs uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <Info className="h-3.5 w-3.5" />
            {label}
          </div>
        </div>
      )}

      {onStartDateChange && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Fecha Inicio Ciclo</label>
          <Input
            type="date"
            className="w-full h-12 sm:h-10 text-lg sm:text-sm rounded-md border-input bg-background hover:bg-accent/50 transition-colors"
            value={
              startDate
                ? typeof startDate === 'string'
                  ? startDate.split('T')[0]
                  : format(new Date(startDate), 'yyyy-MM-dd')
                : ''
            }
            onChange={(e) => onStartDateChange(e.target.value)}
          />
        </div>
      )}

      <div
        className={cn(
          'relative overflow-hidden rounded-2xl border-2 p-6 transition-all duration-300',
          state.status === 'active'
            ? 'bg-primary/5 border-primary/20'
            : 'bg-card border-border'
        )}
      >
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 rounded-full bg-current opacity-5 blur-3xl text-primary" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center gap-4">
          {state.status === 'active' ? (
            <>
              <div className="flex items-center gap-2 text-primary font-bold bg-background/80 px-4 py-1.5 rounded-full text-sm shadow-sm border border-primary/10 backdrop-blur-sm">
                <Clock className="h-4 w-4" />
                <span>Semana {state.weekNumber} de 16</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-6xl mb-4 font-black tracking-tight text-foreground">
                  {state.verb}
                </h3>
                {state.description ? (
                  <p className="text-muted-foreground font-medium">
                    {state.description}
                  </p>
                ) : (
                  <p className="text-muted-foreground font-medium">
                    Acción de la semana
                  </p>
                )}
                {state.weekStartDate && state.weekEndDate && (
                  <p className="text-md mt-4 text-primary/70 font-medium">
                    {format(state.weekStartDate, "d 'de' MMMM", { locale: es })}{' '}
                    - {format(state.weekEndDate, "d 'de' MMMM", { locale: es })}
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-2">
                <CalendarIcon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                {state.message}
              </h3>
              {startDate && state.status === 'pending' && (
                <p className="text-sm text-muted-foreground">
                  Inicia el{' '}
                  {format(new Date(startDate), "d 'de' MMMM, yyyy", {
                    locale: es,
                  })}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

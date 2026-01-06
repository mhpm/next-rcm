'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type FilterType = 'year' | 'cuatrimestre' | 'trimestre' | 'month';

interface PeriodFilterProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  filterType: FilterType;
  onTypeChange: (type: FilterType) => void;
  selectedPeriod: number | null;
  onPeriodChange: (period: number) => void;
}

export function PeriodFilter({
  selectedYear,
  onYearChange,
  filterType,
  onTypeChange,
  selectedPeriod,
  onPeriodChange,
}: PeriodFilterProps) {
  const currentYear = new Date().getFullYear();

  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  return (
    <div className="flex items-center gap-2">
      <Select
        value={String(selectedYear)}
        onValueChange={(v) => onYearChange(Number(v))}
      >
        <SelectTrigger className="w-24">
          <SelectValue placeholder="Año" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 5 }, (_, i) => currentYear - 2 + i).map(
            (year) => (
              <SelectItem key={year} value={String(year)}>
                {year}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>

      <Select
        value={filterType}
        onValueChange={(v) => onTypeChange(v as any)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="year">Todo el año</SelectItem>
          <SelectItem value="cuatrimestre">Por Cuatrimestre</SelectItem>
          <SelectItem value="trimestre">Por Trimestre</SelectItem>
          <SelectItem value="month">Por Mes</SelectItem>
        </SelectContent>
      </Select>

      {filterType === 'cuatrimestre' && (
        <div className="flex">
          {[1, 2, 3].map((p) => (
            <Button
              key={p}
              variant={selectedPeriod === p ? 'default' : 'outline'}
              className={`h-10 rounded-none ${p === 1 ? 'rounded-l-md' : ''} ${
                p === 3 ? 'rounded-r-md' : ''
              }`}
              onClick={() => onPeriodChange(p)}
            >
              {p}º C
            </Button>
          ))}
        </div>
      )}

      {filterType === 'trimestre' && (
        <div className="flex">
          {[1, 2, 3, 4].map((p) => (
            <Button
              key={p}
              variant={selectedPeriod === p ? 'default' : 'outline'}
              className={`h-10 rounded-none ${p === 1 ? 'rounded-l-md' : ''} ${
                p === 4 ? 'rounded-r-md' : ''
              }`}
              onClick={() => onPeriodChange(p)}
            >
              {p}º T
            </Button>
          ))}
        </div>
      )}

      {filterType === 'month' && (
        <Select
          value={selectedPeriod !== null ? String(selectedPeriod) : undefined}
          onValueChange={(v) => onPeriodChange(Number(v))}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Seleccionar Mes" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month, index) => (
              <SelectItem key={index} value={String(index)}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

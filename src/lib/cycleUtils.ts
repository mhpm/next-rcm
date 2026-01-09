import {
  startOfDay,
  differenceInCalendarDays,
  isBefore,
  addDays,
} from 'date-fns';

export const DEFAULT_VERBS = [
  'Orar',
  'Anotar',
  'Contactar',
  'Confirmar',
  'Desatar',
  'Llevar',
  'Motivar',
  'Integrar',
  'Consolidar',
  'Preparar',
  'Santificar',
  'Matricular',
  'Conservar',
  'Doctrinar',
  'Discipular',
  'Bautizar',
];

export type VerbOption = string | { value: string; description?: string };

export function calculateCycleState(
  startDate: string | Date | null | undefined,
  customVerbs?: VerbOption[],
  currentDate?: Date | string | null
) {
  if (!startDate) {
    return {
      status: 'not_configured',
      message: 'Fecha de inicio no configurada',
      verb: null,
      description: null,
    };
  }

  let start: Date;
  if (typeof startDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
    const [year, month, day] = startDate.split('-').map(Number);
    start = new Date(year, month - 1, day);
  } else {
    start = new Date(startDate);
  }
  start = startOfDay(start);

  let now: Date;
  if (currentDate) {
    if (
      typeof currentDate === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(currentDate)
    ) {
      const [year, month, day] = currentDate.split('-').map(Number);
      now = new Date(year, month - 1, day);
    } else {
      now = new Date(currentDate);
    }
    now = startOfDay(now);
  } else {
    now = startOfDay(new Date());
  }

  if (isBefore(now, start)) {
    return {
      status: 'pending',
      message: 'Aún no inicia',
      verb: null,
      description: null,
    };
  }

  const daysDiff = differenceInCalendarDays(now, start);
  const weeksPassed = Math.floor(daysDiff / 7);

  // Week is 1-based (0-6 days = Week 1)
  const currentWeekIndex = weeksPassed;

  if (currentWeekIndex >= 16) {
    return {
      status: 'completed',
      message: 'Esperando nuevo inicio de ciclo',
      verb: null,
      description: null,
    };
  }

  const verbs =
    customVerbs && customVerbs.length > 0 ? customVerbs : DEFAULT_VERBS;

  const currentVerbEntry = verbs[currentWeekIndex];
  let verb = 'Sin verbo';
  let description: string | null = null;

  if (typeof currentVerbEntry === 'string') {
    verb = currentVerbEntry;
  } else if (currentVerbEntry) {
    verb = currentVerbEntry.value;
    description = currentVerbEntry.description || null;
  }

  const weekStartDate = addDays(start, currentWeekIndex * 7);
  const weekEndDate = addDays(weekStartDate, 6);

  return {
    status: 'active',
    message: null,
    verb,
    description,
    weekNumber: currentWeekIndex + 1,
    weekStartDate,
    weekEndDate,
  };
}

export function getCycleStateForWeek(
  weekNumber: number,
  startDate?: string | Date | null,
  customVerbs?: VerbOption[]
) {
  const currentWeekIndex = weekNumber - 1;
  const verbs =
    customVerbs && customVerbs.length > 0 ? customVerbs : DEFAULT_VERBS;

  if (currentWeekIndex < 0 || currentWeekIndex >= 16) {
    return {
      status: 'invalid',
      message: 'Semana inválida',
      verb: null,
      description: null,
    };
  }

  const currentVerbEntry = verbs[currentWeekIndex] || 'Sin verbo';
  let verb = 'Sin verbo';
  let description: string | null = null;

  if (typeof currentVerbEntry === 'string') {
    verb = currentVerbEntry;
  } else if (currentVerbEntry) {
    verb = currentVerbEntry.value;
    description = currentVerbEntry.description || null;
  }

  let weekStartDate: Date | undefined;
  let weekEndDate: Date | undefined;

  if (startDate) {
    let start: Date;
    if (
      typeof startDate === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(startDate)
    ) {
      const [year, month, day] = startDate.split('-').map(Number);
      start = new Date(year, month - 1, day);
    } else {
      start = new Date(startDate);
    }
    start = startOfDay(start);
    weekStartDate = addDays(start, currentWeekIndex * 7);
    weekEndDate = addDays(weekStartDate, 6);
  }

  return {
    status: 'active',
    message: null,
    verb,
    description,
    weekNumber,
    weekStartDate,
    weekEndDate,
  };
}

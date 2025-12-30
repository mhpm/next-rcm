'use client';

import { useMemo, useState } from 'react';
import { DataTable } from '@/components';
import { TableColumn, TableAction } from '@/types';
import { EventWithStats, EventFormData } from '../types/events.d';
import { EventDialog } from './EventDialog';
import { AttendanceDialog } from './AttendanceDialog';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Plus, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import { deleteEvent } from '../actions/events.actions';
import { useNotificationStore } from '@/store/NotificationStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EventsListProps {
  events: EventWithStats[];
}

export function EventsList({ events }: EventsListProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventFormData | undefined>(
    undefined
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<EventWithStats | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const { showSuccess, showError } = useNotificationStore();

  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [attendanceEvent, setAttendanceEvent] = useState<EventWithStats | null>(
    null
  );

  // Filter states
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [filterType, setFilterType] = useState<
    'year' | 'cuatrimestre' | 'trimestre' | 'month'
  >('year');
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);

  const handleDeleteClick = (event: EventWithStats) => {
    setEventToDelete(event);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    try {
      setIsDeleting(true);
      await deleteEvent(eventToDelete.id);
      showSuccess('Evento eliminado exitosamente');
      setIsDeleteModalOpen(false);
      setEventToDelete(null);
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      showError('Error al eliminar el evento');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtering Logic
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const date = new Date(event.date);
      const year = date.getFullYear();
      const month = date.getMonth(); // 0-11

      if (year !== selectedYear) return false;

      if (filterType === 'year') return true;

      if (filterType === 'cuatrimestre' && selectedPeriod !== null) {
        // 1: 0-3, 2: 4-7, 3: 8-11
        const startMonth = (selectedPeriod - 1) * 4;
        const endMonth = startMonth + 3;
        return month >= startMonth && month <= endMonth;
      }

      if (filterType === 'trimestre' && selectedPeriod !== null) {
        // 1: 0-2, 2: 3-5, 3: 6-8, 4: 9-11
        const startMonth = (selectedPeriod - 1) * 3;
        const endMonth = startMonth + 2;
        return month >= startMonth && month <= endMonth;
      }

      if (filterType === 'month' && selectedPeriod !== null) {
        return month === selectedPeriod;
      }

      return true;
    });
  }, [events, selectedYear, filterType, selectedPeriod]);

  const handlePeriodClick = (period: number) => {
    setSelectedPeriod(period === selectedPeriod ? null : period);
  };

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

  const columns: TableColumn<EventWithStats>[] = [
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
    },
    {
      key: 'date',
      label: 'Fecha',
      sortable: true,
      render: (date) =>
        format(new Date(date as string | Date), 'PPP', { locale: es }),
    },
    {
      key: 'type',
      label: 'Tipo',
      sortable: true,
    },
    {
      key: 'phase',
      label: 'Fase',
      render: (_, row: EventWithStats) =>
        row.phase ? (
          <div className="flex items-center gap-2">
            {row.phase.color && (
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: row.phase.color }}
              />
            )}
            <span>{row.phase.name}</span>
          </div>
        ) : (
          '-'
        ),
    },
    {
      key: 'friendAttendanceGoal',
      label: 'Meta Amigos',
      sortable: true,
      render: (value) => String(value || 0),
    },
    {
      key: 'memberAttendanceGoal',
      label: 'Meta Miembros',
      sortable: true,
      render: (value) => String(value || 0),
    },
    {
      key: '_count',
      label: 'Asistentes',
      render: (_, row) => row._count.attendances,
    },
    {
      key: 'createdAt',
      label: 'Asistencia',
      render: (_, row) => (
        <Button
          key={row.id}
          variant="secondary"
          size="sm"
          className="h-8"
          onClick={(e) => {
            e.stopPropagation();
            setAttendanceEvent(row);
            setIsAttendanceOpen(true);
          }}
        >
          <Users className="w-4 h-4 mr-2" />
          Gestionar
        </Button>
      ),
    },
  ];

  const actions: TableAction<EventWithStats>[] = [
    {
      label: 'Editar',
      onClick: (row) => {
        setSelectedEvent(row);
        setIsEditOpen(true);
      },
    },
    {
      label: 'Eliminar',
      variant: 'destructive',
      onClick: (row) => handleDeleteClick(row),
    },
  ];

  const filterControls = (
    <div className="flex items-center gap-2">
      <Select
        value={String(selectedYear)}
        onValueChange={(v) => setSelectedYear(Number(v))}
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
        onValueChange={(v: any) => {
          setFilterType(v);
          setSelectedPeriod(null);
        }}
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
          {[1, 2, 3].map((q) => (
            <Button
              key={q}
              variant={selectedPeriod === q ? 'default' : 'outline'}
              className={`h-10 rounded-none ${q === 1 ? 'rounded-l-md' : ''} ${
                q === 3 ? 'rounded-r-md' : ''
              }`}
              onClick={() => handlePeriodClick(q)}
            >
              {q}º C
            </Button>
          ))}
        </div>
      )}

      {filterType === 'trimestre' && (
        <div className="flex">
          {[1, 2, 3, 4].map((t) => (
            <Button
              key={t}
              variant={selectedPeriod === t ? 'default' : 'outline'}
              className={`h-10 rounded-none ${t === 1 ? 'rounded-l-md' : ''} ${
                t === 4 ? 'rounded-r-md' : ''
              }`}
              onClick={() => handlePeriodClick(t)}
            >
              {t}º T
            </Button>
          ))}
        </div>
      )}

      {filterType === 'month' && (
        <Select
          value={selectedPeriod !== null ? String(selectedPeriod) : ''}
          onValueChange={(v) => handlePeriodClick(Number(v))}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Seleccionar mes" />
          </SelectTrigger>
          <SelectContent>
            {months.map((m, i) => (
              <SelectItem key={i} value={String(i)}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <DataTable
        title="Eventos"
        subTitle="Gestión de eventos y campañas evangelísticas"
        data={filteredEvents}
        columns={columns}
        actions={actions}
        searchable
        searchPlaceholder="Buscar eventos..."
        pagination
        itemsPerPage={10}
        addButton={() => (
          <div className="flex gap-2">
            <EventDialog
              trigger={
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Evento
                </Button>
              }
            />
            <Button variant="outline" asChild>
              <Link href="/events/phases">
                <Settings className="mr-2 h-4 w-4" />
                Fases
              </Link>
            </Button>
          </div>
        )}
        searchEndContent={filterControls}
      />

      <EventDialog
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) setSelectedEvent(undefined);
        }}
        initialData={selectedEvent}
        title="Editar Evento"
      />

      <AttendanceDialog
        open={isAttendanceOpen}
        onOpenChange={(open) => {
          setIsAttendanceOpen(open);
          if (!open) setAttendanceEvent(null);
        }}
        eventId={attendanceEvent?.id || ''}
        eventName={attendanceEvent?.name || ''}
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        entityName={eventToDelete?.name}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setEventToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        isPending={isDeleting}
      />
    </div>
  );
}

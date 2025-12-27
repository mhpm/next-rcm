'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNotificationStore } from '@/store/NotificationStore';

import { createEvent, updateEvent, getEventPhases } from '../actions/events.actions';
import { eventSchema, EventFormValues } from '../schema/events.schema';
import { EventFormData } from '../types/events.d';
import { EventPhases } from '@/generated/prisma/client';

interface EventFormProps {
  initialData?: EventFormData;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EventForm({
  initialData,
  onSuccess,
  onCancel,
}: EventFormProps) {
  const router = useRouter();
  const { addNotification } = useNotificationStore();
  const [loading, setLoading] = useState(false);
  const [phases, setPhases] = useState<EventPhases[]>([]);

  useEffect(() => {
    getEventPhases().then(setPhases);
  }, []);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema) as any,
    defaultValues: {
      name: initialData?.name || '',
      type: initialData?.type || '',
      date: initialData?.date || new Date(),
      friendAttendanceGoal: initialData?.friendAttendanceGoal || undefined,
      memberAttendanceGoal: initialData?.memberAttendanceGoal || undefined,
      phase_id: initialData?.phase_id || undefined,
    },
  });

  const onSubmit = async (data: EventFormValues) => {
    setLoading(true);
    try {
      if (initialData?.id) {
        await updateEvent(initialData.id, data);
        addNotification({
          type: 'success',
          title: 'Evento actualizado',
          message: 'El evento se ha actualizado correctamente.',
        });
      } else {
        await createEvent(data);
        addNotification({
          type: 'success',
          title: 'Evento creado',
          message: 'El evento se ha creado correctamente.',
        });
      }

      router.refresh();
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/events');
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Ha ocurrido un error al guardar el evento.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField<EventFormValues, 'name'>
            control={form.control as any}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Evento</FormLabel>
                <FormControl>
                  <Input placeholder="Ej. Culto Dominical" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField<EventFormValues, 'type'>
            control={form.control as any}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Evento</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Culto">Culto</SelectItem>
                    <SelectItem value="Campaña">Campaña</SelectItem>
                    <SelectItem value="Reunión Especial">
                      Reunión Especial
                    </SelectItem>
                    <SelectItem value="Conferencia">Conferencia</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField<EventFormValues, 'date'>
            control={form.control as any}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha del Evento</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    placeholder="Selecciona una fecha"
                    {...field}
                    value={
                      field.value instanceof Date
                        ? new Date(
                            field.value.getTime() -
                              field.value.getTimezoneOffset() * 60000
                          )
                            .toISOString()
                            .slice(0, 16)
                        : field.value
                    }
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      field.onChange(date);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField<EventFormValues, 'friendAttendanceGoal'>
            control={form.control as any}
            name="friendAttendanceGoal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Asistencia Amigos (Opcional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Ej. 50"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField<EventFormValues, 'memberAttendanceGoal'>
            control={form.control as any}
            name="memberAttendanceGoal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Asistencia Miembros (Opcional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Ej. 100"
                    {...field}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField<EventFormValues, 'phase_id'>
            control={form.control as any}
            name="phase_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fase (Opcional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || undefined}
                  value={field.value || undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una fase" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {phases.map((phase) => (
                      <SelectItem key={phase.id} value={phase.id}>
                        <div className="flex items-center gap-2">
                          {phase.color && (
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: phase.color }}
                            />
                          )}
                          {phase.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (onCancel) {
                onCancel();
              } else {
                router.back();
              }
            }}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading
              ? 'Guardando...'
              : initialData
              ? 'Actualizar Evento'
              : 'Crear Evento'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

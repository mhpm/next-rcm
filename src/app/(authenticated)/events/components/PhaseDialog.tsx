'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { useNotificationStore } from '@/store/NotificationStore';
import { createPhase, updatePhase } from '../actions/phases.actions';
import { phaseSchema, PhaseFormValues } from '../schema/phases.schema';
import { EventPhases } from '@/generated/prisma/client';

interface PhaseDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialData?: EventPhases & { isSystem?: boolean };
  title?: string;
  onSuccess?: () => void;
}

export function PhaseDialog({
  trigger,
  open,
  onOpenChange,
  initialData,
  title = 'Nueva Fase',
  onSuccess,
}: PhaseDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotificationStore();

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled
    ? onOpenChange
    : (value: boolean) => setInternalOpen(value);

  const form = useForm<PhaseFormValues>({
    resolver: zodResolver(phaseSchema),
    defaultValues: {
      name: '',
      color: '#000000',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        color: initialData.color || '#000000',
      });
    } else {
      form.reset({
        name: '',
        color: '#000000',
      });
    }
  }, [initialData, form]);

  const onSubmit = async (data: PhaseFormValues) => {
    setLoading(true);
    try {
      if (initialData?.id) {
        await updatePhase(initialData.id, data);
        addNotification({
          type: 'success',
          title: 'Fase actualizada',
          message: 'La fase se ha actualizado correctamente.',
        });
      } else {
        await createPhase(data);
        addNotification({
          type: 'success',
          title: 'Fase creada',
          message: 'La fase se ha creado correctamente.',
        });
      }

      setIsOpen && setIsOpen(false);
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error(error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Ha ocurrido un error al guardar la fase.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Fase' : title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Liderazgo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <div className="flex gap-2 items-center">
                    <FormControl>
                      <Input type="color" className="w-12 h-10 p-1" {...field} />
                    </FormControl>
                    <Input 
                        {...field} 
                        placeholder="#000000" 
                        className="font-mono"
                        maxLength={7}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen && setIsOpen(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

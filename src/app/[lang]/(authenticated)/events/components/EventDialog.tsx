'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { EventForm } from './EventForm';
import { EventFormData } from '../types/events.d';

interface EventDialogProps {
  initialData?: EventFormData;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EventDialog({
  initialData,
  trigger,
  title = 'Nuevo Evento',
  description = 'Complete el formulario para registrar un nuevo evento.',
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: EventDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = isControlled ? setControlledOpen! : setUncontrolledOpen;

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar Evento' : title}</DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Modifique los detalles del evento a continuación.'
              : description}
          </DialogDescription>
        </DialogHeader>
        <EventForm
          initialData={initialData}
          onSuccess={handleSuccess}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

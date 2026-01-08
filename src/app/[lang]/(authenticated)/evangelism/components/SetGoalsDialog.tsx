'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { setCellGoal } from '../actions/goals.actions';
import { Pencil } from 'lucide-react';
import { useNotificationStore } from '@/store/NotificationStore';

interface SetGoalsDialogProps {
  cellId: string;
  eventId: string;
  eventName: string;
  currentTarget: number;
}

export function SetGoalsDialog({
  cellId,
  eventId,
  eventName,
  currentTarget,
}: SetGoalsDialogProps) {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState(currentTarget.toString());
  const [loading, setLoading] = useState(false);
  const { addNotification } = useNotificationStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await setCellGoal({
        cellId,
        eventId,
        target: parseInt(target),
      });
      setOpen(false);
      addNotification({
        type: 'success',
        title: 'Meta actualizada',
        message: 'La meta ha sido actualizada exitosamente.',
        duration: 3000,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Hubo un error al actualizar la meta.',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
          <Pencil className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Establecer Meta</DialogTitle>
          <DialogDescription>
            Establece la meta de amigos para el evento: {eventName}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="target" className="text-right">
                Meta
              </Label>
              <Input
                id="target"
                type="number"
                min="0"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Copy, Plus } from 'lucide-react';
import { cloneReportAction } from '../actions/reports.actions';
import { toast } from 'sonner';

export default function CloneReportButton({ lang }: { lang: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [sourceId, setSourceId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClone = async () => {
    if (!sourceId) return;

    setIsLoading(true);
    try {
      await cloneReportAction(sourceId);
      toast.success('Formulario clonado exitosamente');
      setIsOpen(false);
      setSourceId('');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || 'Error al clonar el formulario');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center">
        <Button
          className="rounded-r-none"
          onClick={() => router.push(`/${lang}/reports/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Crear formulario
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="rounded-l-none border-l border-primary-foreground/20 px-2"
              variant="default"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsOpen(true)}>
              <Copy className="mr-2 h-4 w-4" />
              Clonar formulario
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clonar formulario</DialogTitle>
            <DialogDescription>
              Ingresa el ID del formulario que deseas clonar. Se copiará la
              estructura pero no los datos.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sourceId">ID del Formulario</Label>
              <Input
                id="sourceId"
                placeholder="Ej. 123e4567-e89b..."
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleClone} disabled={!sourceId || isLoading}>
              {isLoading ? 'Clonando...' : 'Clonar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

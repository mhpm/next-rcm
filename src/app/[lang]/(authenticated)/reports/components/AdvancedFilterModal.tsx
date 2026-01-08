'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { RiFilter3Line, RiDeleteBinLine } from 'react-icons/ri';
import { InputField, SelectField } from '@/components/FormControls';
import type { ReportFieldType } from '@/generated/prisma/client';
import { DEFAULT_VERBS } from '@/lib/cycleUtils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
// ScrollArea no está disponible; usamos un contenedor con overflow

export type FilterField = {
  id: string;
  key: string;
  label?: string | null;
  type: ReportFieldType;
  options?: string[] | any[];
};

type AdvancedFilterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: Record<string, any>) => void;
  onClear: () => void;
  fields: FilterField[];
  activeFilters: Record<string, any>;
  title?: string;
};

export default function AdvancedFilterModal({
  isOpen,
  onClose,
  onApply,
  onClear,
  fields,
  activeFilters,
  title,
}: AdvancedFilterModalProps) {
  const { register, handleSubmit, reset, control } = useForm();

  // Reset form when modal opens or activeFilters change
  useEffect(() => {
    if (isOpen) {
      reset(activeFilters);
    }
  }, [isOpen, activeFilters, reset]);

  const onSubmit = (data: Record<string, any>) => {
    // Filter out empty values
    const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    onApply(cleanData);
    onClose();
  };

  const handleClear = () => {
    reset({});
    onClear();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RiFilter3Line className="text-primary" />
            {title || 'Filtros Avanzados'}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 flex-1 flex flex-col min-h-0"
        >
          <div className="flex-1 overflow-y-auto pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
              {/* Campos fijos */}
              <InputField
                name="entidad"
                label="Entidad"
                register={register}
                placeholder="Buscar por nombre de entidad..."
              />

              <InputField
                name="createdAt_from"
                label="Fecha (Desde)"
                type="date"
                register={register}
              />

              <InputField
                name="createdAt_to"
                label="Fecha (Hasta)"
                type="date"
                register={register}
              />

              {/* Campos dinámicos del reporte */}
              {fields.map((field) => (
                <div key={field.id} className="w-full">
                  {field.type === 'TEXT' && (
                    <InputField
                      name={field.id}
                      label={field.label || field.key}
                      register={register}
                      placeholder="Contiene..."
                    />
                  )}

                  {field.type === 'CYCLE_WEEK_INDICATOR' && (
                    <SelectField
                      name={field.id}
                      label={field.label || field.key}
                      control={control}
                      options={[
                        { value: '', label: 'Todos' },
                        ...(field.options && field.options.length > 0
                          ? field.options
                          : DEFAULT_VERBS
                        ).map((verb, index) => {
                          const verbValue =
                            typeof verb === 'string' ? verb : verb.value;
                          return {
                            value: `Semana ${index + 1}:`,
                            label: `Semana ${index + 1}: ${verbValue}`,
                          };
                        }),
                      ]}
                    />
                  )}

                  {(field.type === 'NUMBER' || field.type === 'CURRENCY') && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {field.label || field.key}
                      </label>
                      <div className="flex gap-2">
                        <InputField
                          name={`${field.id}_min`}
                          label=""
                          type="number"
                          step={field.type === 'CURRENCY' ? '0.01' : '1'}
                          register={register}
                          placeholder="Min"
                          className="mt-0"
                        />
                        <InputField
                          name={`${field.id}_max`}
                          label=""
                          type="number"
                          step={field.type === 'CURRENCY' ? '0.01' : '1'}
                          register={register}
                          placeholder="Max"
                          className="mt-0"
                        />
                      </div>
                    </div>
                  )}

                  {field.type === 'BOOLEAN' && (
                    <SelectField
                      name={field.id}
                      label={field.label || field.key}
                      control={control}
                      options={[
                        { value: '', label: 'Todos' },
                        { value: 'true', label: 'Sí' },
                        { value: 'false', label: 'No' },
                      ]}
                    />
                  )}

                  {field.type === 'DATE' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {field.label || field.key}
                      </label>
                      <div className="flex gap-2">
                        <InputField
                          name={`${field.id}_from`}
                          label=""
                          type="date"
                          register={register}
                          className="mt-0"
                        />
                        <InputField
                          name={`${field.id}_to`}
                          label=""
                          type="date"
                          register={register}
                          className="mt-0"
                        />
                      </div>
                    </div>
                  )}

                  {field.type === 'SELECT' && (
                    <SelectField
                      name={field.id}
                      label={field.label || field.key}
                      control={control}
                      options={[
                        { value: '', label: 'Todos' },
                        ...(field.options || []).map((opt) => ({
                          value: opt,
                          label: opt,
                        })),
                      ]}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="flex justify-between items-center w-full sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              className="text-destructive hover:text-destructive/90"
              onClick={handleClear}
            >
              <RiDeleteBinLine className="mr-2" />
              Limpiar filtros
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Aplicar Filtros</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import React, { useEffect, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  InputField,
  MemberSearchField,
  SelectField,
} from '@/components/FormControls';
import {
  sectorFormSchema,
  type SectorFormInput,
} from '../schema/sectors.schema';
import { useQuery } from '@tanstack/react-query';
import { getAllSectors } from '../actions/sectors.actions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SectorFormProps {
  initialData?: Partial<SectorFormInput> & { id?: string };
  onSubmit: SubmitHandler<SectorFormInput>;
  isEditMode?: boolean;
  isSubmitting?: boolean;
}

const SectorForm: React.FC<SectorFormProps> = ({
  initialData,
  onSubmit,
  isEditMode = false,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<SectorFormInput>({
    defaultValues: initialData,
    mode: 'onChange',
    resolver: zodResolver(sectorFormSchema),
  });

  // Fetch all sectors for the parent selector
  const { data: sectorsData } = useQuery({
    queryKey: ['sectors', 'all'],
    queryFn: () => getAllSectors({ limit: 1000 }),
  });

  const parentOptions = (sectorsData?.sectors || [])
    .filter((s) => s.id !== initialData?.id) // Prevent selecting itself as parent
    .map((s) => ({
      value: s.id,
      label: s.name,
    }));

  const parentSelectOptions = [
    { value: '', label: 'Sin sector padre (Sector Principal)' },
    ...parentOptions,
  ];

  const prevInitialDataRef = useRef<string | null>(null);
  useEffect(() => {
    const json = JSON.stringify(initialData ?? {});
    if (prevInitialDataRef.current === json) return;
    prevInitialDataRef.current = json;
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleSubmitInternal = async (data: SectorFormInput) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error al enviar el formulario', error);
    }
  };

  // Watch parentId to update the value when options are loaded
  useEffect(() => {
    if (initialData?.parentId && sectorsData?.sectors) {
      setValue('parentId', initialData.parentId);
    }
  }, [initialData?.parentId, sectorsData?.sectors, setValue]);

  return (
    <form onSubmit={handleSubmit(handleSubmitInternal)} className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Nombre del Sector"
                  name="name"
                  register={register}
                  error={errors.name?.message}
                  placeholder="Ej. Sector Norte"
                />

                <SelectField
                  label="Sector Padre (Opcional)"
                  name="parentId"
                  control={control}
                  error={errors.parentId?.message}
                  options={parentSelectOptions}
                  disabled={isEditMode} // Cannot change parent on edit for now to avoid loops
                />
              </div>

              <MemberSearchField
                label="Supervisor"
                name="supervisorId"
                register={register}
                setValue={setValue}
                watch={watch}
                error={errors.supervisorId?.message}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full lg:w-auto"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SectorForm;

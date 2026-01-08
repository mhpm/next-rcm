'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputField, MemberSearchField } from '@/components/FormControls';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import {
  ministryFormSchema,
  type MinistryFormInput,
} from '@/app/[lang]/(authenticated)/ministries/schema/ministries.schema';
export type { MinistryFormInput } from '@/app/[lang]/(authenticated)/ministries/schema/ministries.schema';

interface MinistryFormProps {
  initialData?: Partial<MinistryFormInput> & { id?: string };
  onSubmit: SubmitHandler<MinistryFormInput>;
  isEditMode?: boolean;
  isSubmitting?: boolean;
}

/**
 * MinistryForm
 * Formulario reusable para Crear y Editar Ministerios.
 * - Usa los FormControls del proyecto para mantener un estilo consistente con Members.
 */
const MinistryForm: React.FC<MinistryFormProps> = ({
  initialData,
  onSubmit,
  isEditMode = false,
  isSubmitting = false,
}) => {
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || 'es';
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MinistryFormInput>({
    defaultValues: initialData,
    mode: 'onChange',
    resolver: zodResolver(ministryFormSchema),
  });

  // Reset cuando cambian los datos iniciales (útil en modo edición)
  const prevInitialDataRef = useRef<string | null>(null);
  useEffect(() => {
    const json = JSON.stringify(initialData ?? {});
    // Evitar reestablecer el formulario si el contenido de initialData no cambió
    if (prevInitialDataRef.current === json) return;
    prevInitialDataRef.current = json;
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  // Observar el leaderId actual del formulario

  const handleSubmitInternal = async (data: MinistryFormInput) => {
    try {
      await onSubmit(data);
      // Mantener sincronizados los valores del formulario con lo enviado
      // para evitar que visualmente se "regenere" con los valores antiguos.
      reset(data);
      // Actualizar referencia para que el efecto de initialData no sobrescriba lo enviado
      prevInitialDataRef.current = JSON.stringify(data ?? {});
    } catch (error) {
      console.error('Error al enviar el formulario', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitInternal)} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Información</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField<MinistryFormInput>
              name="name"
              label="Nombre del Ministerio"
              register={register}
              rules={{ required: 'El nombre es requerido' }}
              defaultValue={initialData?.name}
              error={errors.name?.message}
            />
            <InputField<MinistryFormInput>
              name="description"
              label="Descripción"
              register={register}
              defaultValue={initialData?.description}
              placeholder="Breve descripción"
            />
          </div>
          <div className="border-t pt-6">
            <MemberSearchField<MinistryFormInput>
              name="leaderId"
              label="Líder del Ministerio"
              register={register}
              setValue={setValue}
              watch={watch}
              error={errors.leaderId?.message}
            />
          </div>
        </CardContent>
      </Card>

      {/* Botones de acción */}
      <div className="flex justify-end gap-4 mt-8">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push(`/${lang}/ministries`)}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditMode ? 'Actualizando...' : 'Guardando...'}
            </>
          ) : isEditMode ? (
            'Actualizar Ministerio'
          ) : (
            'Crear Ministerio'
          )}
        </Button>
      </div>
    </form>
  );
};

export default MinistryForm;

'use client';

import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  Control,
} from 'react-hook-form';
import { InputField, SelectField } from '@/components/FormControls';
import { ColorPicker } from './ColorPicker';
import { ReportFormValues } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GeneralSettingsFormProps {
  register: UseFormRegister<ReportFormValues>;
  watch: UseFormWatch<ReportFormValues>;
  setValue: UseFormSetValue<ReportFormValues>;
  control: Control<ReportFormValues>;
}

export function GeneralSettingsForm({
  register,
  watch,
  setValue,
  control,
}: GeneralSettingsFormProps) {
  const color = watch('color');

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Configuración General</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <InputField
            name="title"
            label="Título del Reporte"
            register={register}
            rules={{ required: 'Requerido' }}
            placeholder="ej. Reporte Semanal de Célula"
          />
          <InputField
            name="description"
            label="Descripción (Opcional)"
            register={register}
            placeholder="Instrucciones para llenar el reporte..."
          />
          <SelectField
            name="scope"
            label="Tipo de Entidad"
            control={control}
            options={[
              { value: 'CELL', label: 'Célula' },
              { value: 'GROUP', label: 'Grupo' },
              { value: 'SECTOR', label: 'Sector' },
              { value: 'CHURCH', label: 'Iglesia' },
            ]}
          />
          <ColorPicker
            selected={color || '#3b82f6'}
            onChange={(color) => setValue('color', color)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

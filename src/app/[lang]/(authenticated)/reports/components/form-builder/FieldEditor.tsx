import React from 'react';
import {
  Control,
  Controller,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';
import { FaCopy, FaTrash } from 'react-icons/fa6';
import { InputField, DateField } from '@/components/FormControls';
import { OptionsEditor } from './OptionsEditor';
import { CycleVerbsEditor } from './CycleVerbsEditor';
import { LogicEditor } from './LogicEditor';
import { slugify } from './utils';
import { ReportFormValues, FieldItem } from './types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

interface FieldEditorProps {
  id: string;
  index: number;
  field: FieldItem;
  register: UseFormRegister<ReportFormValues>;
  control: Control<ReportFormValues>;
  setValue: UseFormSetValue<ReportFormValues>;
  onDuplicate: (index: number) => void;
  onRemove: (index: number) => void;
  // UI State props
  advancedExpanded: boolean;
  optionsExpanded: boolean;
  onToggleUi: (id: string, key: 'section' | 'options' | 'advanced') => void;
}

export const FieldEditor = React.memo(function FieldEditor({
  id,
  index,
  field,
  register,
  control,
  setValue,
  onDuplicate,
  onRemove,
  advancedExpanded,
  optionsExpanded,
  onToggleUi,
}: FieldEditorProps) {
  return (
    <div className="p-4 border rounded-lg bg-muted/30 hover:shadow-sm transition-all group">
      {/* Field Header / Actions */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
        <Badge
          variant="outline"
          className="gap-1 cursor-grab active:cursor-grabbing"
        >
          <span className="opacity-70">☰</span>
          <span className="text-xs font-medium text-muted-foreground">
            {field.type === 'TEXT' && 'Texto'}
            {field.type === 'NUMBER' && 'Número'}
            {field.type === 'CURRENCY' && 'Moneda'}
            {field.type === 'BOOLEAN' && 'Sí/No'}
            {field.type === 'DATE' && 'Fecha'}
            {field.type === 'SELECT' && 'Opción Múltiple'}
            {field.type === 'SECTION' && 'Sección'}
            {field.type === 'MEMBER_SELECT' && 'Selección de Miembro'}
            {field.type === 'FRIEND_REGISTRATION' && 'Registro de Amigos'}
            {field.type === 'CYCLE_WEEK_INDICATOR' && 'Indicador de Semana'}
          </span>
        </Badge>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onDuplicate(index)}
            title="Duplicar"
          >
            <FaCopy className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onRemove(index)}
            title="Eliminar"
          >
            <FaTrash className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Field Inputs */}
      <div className="space-y-3">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              {...register(`fields.${index}.label` as const, {
                required: field.type !== 'SECTION',
                onChange: (e) => {
                  if (!field.fieldId) {
                    setValue(`fields.${index}.key`, slugify(e.target.value));
                  }
                },
              })}
              className="font-medium"
              placeholder={
                field.type === 'SECTION'
                  ? 'Título de la sección...'
                  : 'Escribe tu pregunta aquí...'
              }
            />
          </div>
          <div className="flex items-center">
            {field.type !== 'SECTION' && (
              <div className="flex items-center gap-2">
                <Controller
                  control={control}
                  name={`fields.${index}.required` as const}
                  render={({ field: rhfField }) => (
                    <Checkbox
                      checked={!!rhfField.value}
                      onCheckedChange={(checked) =>
                        rhfField.onChange(!!checked)
                      }
                    />
                  )}
                />
                <Label className="text-xs">Obligatorio</Label>
              </div>
            )}
          </div>
        </div>

        {field.type === 'SELECT' && (
          <OptionsEditor
            nestIndex={index}
            control={control}
            register={register}
            isExpanded={optionsExpanded}
            onToggle={() => onToggleUi(id, 'options')}
          />
        )}

        {field.type === 'CYCLE_WEEK_INDICATOR' && (
          <div className="p-4 rounded-lg border border-border space-y-4">
            <h4 className="text-sm font-medium text-foreground">
              Configuración del Ciclo
            </h4>
            <DateField
              name={`fields.${index}.value`}
              label="Fecha de Inicio del Ciclo"
              control={control}
              rules={{ required: 'La fecha de inicio es requerida' }}
              defaultToNow={true}
            />
            <p className="text-xs text-muted-foreground">
              El ciclo de 16 semanas comenzará a contar a partir de esta fecha.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <Controller
                control={control}
                name={`fields.${index}.validation.publicEditPermission`}
                render={({ field: rhfField }) => (
                  <Checkbox
                    checked={!!rhfField.value}
                    onCheckedChange={(checked) => rhfField.onChange(!!checked)}
                  />
                )}
              />
              <Label className="text-xs">
                Permitir modificar la semana en el reporte público
              </Label>
            </div>

            <CycleVerbsEditor
              nestIndex={index}
              control={control}
              register={register}
            />
          </div>
        )}

        {/* Allow LogicEditor for SECTION type too, but maybe hide key editing if needed, or allow it.
            Currently the block is hidden for SECTION. Let's remove the check for SECTION or make it conditional inside.
        */}
        <Collapsible
          open={advancedExpanded}
          onOpenChange={(open) => {
            if (open !== advancedExpanded) onToggleUi(id, 'advanced');
          }}
          className="rounded-md border bg-card"
        >
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-between px-3 py-2 text-xs font-medium text-muted-foreground"
            >
              Opciones avanzadas
              <ChevronDown
                className={`transition-transform ${
                  advancedExpanded ? 'rotate-180' : ''
                }`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-3 pb-3 text-sm">
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                name={`fields.${index}.key`}
                label="ID de base de datos (slug)"
                register={register}
                rules={{ required: 'Requerido' }}
                placeholder={field.fieldId ? 'Bloqueado' : 'Autogenerado...'}
                disabled={!!field.fieldId}
                tabIndex={field.fieldId ? -1 : undefined}
              />
            </div>

            <div className="pt-4 border-t mt-4">
              <LogicEditor
                fieldIndex={index}
                control={control}
                register={register}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
});

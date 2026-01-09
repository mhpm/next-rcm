import { useEffect, useState } from 'react';
import { UseFormRegister, Control, useFieldArray } from 'react-hook-form';
import { ReportFormValues } from './types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp } from 'lucide-react';

const DEFAULT_VERBS = [
  'Orar',
  'Anotar',
  'Contactar',
  'Confirmar',
  'Desatar',
  'Llevar',
  'Motivar',
  'Integrar',
  'Consolidar',
  'Preparar',
  'Santificar',
  'Matricular',
  'Conservar',
  'Doctrinar',
  'Discipular',
  'Bautizar',
];

interface CycleVerbsEditorProps {
  nestIndex: number;
  control: Control<ReportFormValues>;
  register: UseFormRegister<ReportFormValues>;
}

export function CycleVerbsEditor({
  nestIndex,
  control,
  register,
}: CycleVerbsEditorProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { fields, replace } = useFieldArray({
    control,
    name: `fields.${nestIndex}.options`,
  });

  const handleRestoreDefaults = () => {
    const defaults = DEFAULT_VERBS.map((v) => ({ value: v }));
    replace(defaults);
  };

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  useEffect(() => {
    if (fields.length === 0) {
      handleRestoreDefaults();
    }
  }, []); // Only on mount if empty

  return (
    <div className="space-y-4 mt-4 border-t pt-4 border-border">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-medium text-foreground">
          Verbos del Ciclo (16 Semanas)
        </h5>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleCollapse}
            className="text-xs h-7 gap-1"
          >
            {isCollapsed ? (
              <>
                Mostrar
                <ChevronDown className="h-3 w-3" />
              </>
            ) : (
              <>
                Ocultar
                <ChevronUp className="h-3 w-3" />
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRestoreDefaults}
            className="text-xs h-7"
          >
            Restablecer
          </Button>
        </div>
      </div>
      {!isCollapsed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((field, k) => (
            <div
              key={field.id}
              className="p-3 border border-border rounded-md bg-card space-y-2"
            >
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                Semana {k + 1}
              </Label>
              <div className="space-y-2">
                <Input
                  {...register(
                    `fields.${nestIndex}.options.${k}.value` as const,
                    {
                      required: 'Requerido',
                    }
                  )}
                  className="h-8 text-sm font-medium"
                  placeholder={`Verbo (Ej. Orar)`}
                />
                <Textarea
                  {...register(
                    `fields.${nestIndex}.options.${k}.description` as const
                  )}
                  className="min-h-[60px] text-xs resize-none"
                  placeholder={`Descripción opcional`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

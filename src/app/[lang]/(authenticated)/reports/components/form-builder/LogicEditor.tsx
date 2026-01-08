import {
  UseFormRegister,
  Control,
  useWatch,
  useFieldArray,
} from 'react-hook-form';
import { ReportFormValues } from './types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface LogicEditorProps {
  fieldIndex: number;
  control: Control<ReportFormValues>;
  register: UseFormRegister<ReportFormValues>;
}

export const LogicEditor = ({
  fieldIndex,
  control,
  register,
}: LogicEditorProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `fields.${fieldIndex}.visibilityRules`,
  });

  const allFields = useWatch({
    control,
    name: 'fields',
  });

  // Filter out the current field to avoid circular logic (self-reference)
  // Also filter out sections if they shouldn't trigger logic (usually they don't hold values)
  const availableFields =
    allFields?.filter(
      (f, idx) => idx !== fieldIndex && f.key && f.type !== 'SECTION'
    ) || [];

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          Lógica Condicional (Mostrar si...)
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({ fieldKey: '', operator: 'equals', value: '' })
          }
          className="h-7 text-xs"
        >
          <Plus className="w-3 h-3 mr-1" /> Agregar Regla
        </Button>
      </div>

      <div className="space-y-2">
        {fields.map((rule, index) => (
          <div
            key={rule.id}
            className="flex gap-2 items-start p-3 bg-muted/40 rounded-md border text-sm"
          >
            <div className="grid gap-2 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <select
                  {...register(
                    `fields.${fieldIndex}.visibilityRules.${index}.fieldKey`
                  )}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Seleccionar campo...</option>
                  {availableFields.map((f) => (
                    <option key={f.key} value={f.key}>
                      {f.label || f.key}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2">
                  <select
                    {...register(
                      `fields.${fieldIndex}.visibilityRules.${index}.operator`
                    )}
                    className="flex h-9 w-[120px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="equals">Igual a</option>
                    <option value="notEquals">Diferente de</option>
                    <option value="contains">Contiene</option>
                    <option value="gt">Mayor que</option>
                    <option value="lt">Menor que</option>
                  </select>

                  <Input
                    {...register(
                      `fields.${fieldIndex}.visibilityRules.${index}.value`
                    )}
                    placeholder="Valor..."
                    className="flex-1 h-9"
                  />
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-destructive"
              onClick={() => remove(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {fields.length === 0 && (
          <p className="text-xs text-muted-foreground italic px-1">
            Este elemento siempre será visible. Agrega reglas para hacerlo
            condicional.
          </p>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { Control, useWatch } from 'react-hook-form';
import { ReportFormValues } from './types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

export function LivePreview({ control }: { control: Control<ReportFormValues> }) {
  const values = useWatch({ control });
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>(
    {}
  );

  const groupedFields = React.useMemo(() => {
    const fields = values.fields || [];
    return fields.reduce((groups, f) => {
      const lastGroup = groups[groups.length - 1];

      if (f.type === 'SECTION') {
        if (f.value === 'SECTION_BREAK') {
          // Break section: start a new root group if not already there
          if (!lastGroup || lastGroup.section) {
            groups.push({ section: null, fields: [] });
          }
        } else {
          groups.push({ section: f, fields: [] });
        }
      } else {
        if (!lastGroup) {
          groups.push({ section: null, fields: [f] });
        } else {
          lastGroup.fields.push(f);
        }
      }
      return groups;
    }, [] as { section: any | null; fields: any[] }[]);
  }, [values.fields]);

  const renderField = (field: any, i: number) => {
    return (
      <div key={i} className="w-full rounded-lg border bg-card p-4">
        <div className="flex items-start justify-between gap-3">
          <Label className="font-medium">
            {field.label || `Pregunta ${i + 1}`}
          </Label>
          {field.required && (
            <span className="text-destructive text-sm leading-none">*</span>
          )}
        </div>

        {field.type === 'TEXT' && (
          <Input type="text" placeholder="Tu respuesta" disabled className="mt-2" />
        )}

        {field.type === 'NUMBER' && (
          <Input type="number" placeholder="0" disabled className="mt-2" />
        )}

        {field.type === 'CURRENCY' && (
          <div className="relative mt-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
              $
            </span>
            <Input type="number" placeholder="0.00" disabled className="pl-8" />
          </div>
        )}

        {field.type === 'DATE' && <Input type="date" disabled className="mt-2" />}

        {(field.type === 'BOOLEAN' ||
          field.type === 'SELECT' ||
          field.type === 'MEMBER_SELECT') && (
          <Input disabled className="mt-2" placeholder="Selecciona una opción" />
        )}
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardContent className="p-0 h-full">
        <div className="flex justify-center px-4 py-6 h-full overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="w-full max-w-lg space-y-6">
            <div
              className="text-center mb-8 pb-6 rounded-t-lg border-t-8"
              style={{ borderTopColor: values.color || '#3b82f6' }}
            >
              <h2 className="text-2xl font-bold mt-4">
                {values.title || 'Título del Reporte'}
              </h2>
              {values.description ? (
                <p className="text-muted-foreground mt-2">{values.description}</p>
              ) : (
                <p className="text-muted-foreground/70 italic mt-2">Sin descripción</p>
              )}
            </div>

            <div className="space-y-4">
              {values.scope === 'CELL' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label>Célula</Label>
                    <span className="text-destructive text-sm leading-none">*</span>
                  </div>
                  <Input disabled placeholder="Selecciona una célula" />
                </div>
              )}
              {values.scope === 'GROUP' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label>Grupo</Label>
                    <span className="text-destructive text-sm leading-none">*</span>
                  </div>
                  <Input disabled placeholder="Selecciona un grupo" />
                </div>
              )}
              {values.scope === 'SECTOR' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label>Sector</Label>
                    <span className="text-destructive text-sm leading-none">*</span>
                  </div>
                  <Input disabled placeholder="Selecciona un sector" />
                </div>
              )}

              {groupedFields.map((group, i) => {
                if (group.section) {
                  const sectionKey = String(
                    group.section.key || group.section.tempId || group.section.id || i
                  );
                  const isOpen = openSections[sectionKey] ?? true;
                  return (
                    <Collapsible
                      key={sectionKey}
                      open={isOpen}
                      onOpenChange={(open) =>
                        setOpenSections((prev) => ({ ...prev, [sectionKey]: open }))
                      }
                      className="rounded-lg border"
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full justify-between px-4 py-3"
                        >
                          <span className="text-base font-semibold">
                            {group.section.label || 'Sección'}
                          </span>
                          <ChevronDown
                            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                          />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-4 pb-4">
                        <div className="grid grid-cols-1 gap-4 pt-2">
                          {group.fields.map((f, idx) => renderField(f, idx))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                }
                return (
                  <div key={i} className="grid grid-cols-1 gap-4">
                    {group.fields.map((f, idx) => renderField(f, idx))}
                  </div>
                );
              })}

              {(!values.fields || values.fields.length === 0) && (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-lg">
                  No hay preguntas añadidas
                </div>
              )}
            </div>

            <Separator />
            <div className="flex justify-end py-4">
              <Button disabled className="w-full sm:w-auto">
                Enviar Reporte
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

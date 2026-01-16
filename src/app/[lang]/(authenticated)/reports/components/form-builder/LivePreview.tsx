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
import { ChevronDown, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  CycleWeekIndicator,
  NumberStepper,
  ChoiceGroup,
} from '@/components/FormControls';

export function LivePreview({
  control,
}: {
  control: Control<ReportFormValues>;
}) {
  const values = useWatch({ control });
  const [openSections, setOpenSections] = React.useState<
    Record<string, boolean>
  >({});

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
    const content = (() => {
      if (field.type === 'TEXT') {
        return (
          <div className="space-y-2">
            <Label className="font-medium">
              {field.label || `Pregunta ${i + 1}`}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Input disabled placeholder="Tu respuesta" />
          </div>
        );
      }

      if (field.type === 'NUMBER') {
        return (
          <NumberStepper
            label={field.label || `Pregunta ${i + 1}`}
            value={0}
            onChange={() => {}}
            disabled
            className="w-full"
          />
        );
      }

      if (field.type === 'CURRENCY') {
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 mb-2">
              <span className="text-2xl font-black">$</span>
              <span className="text-xs font-black uppercase tracking-widest">
                {field.label || `Pregunta ${i + 1}`}
              </span>
            </div>
            <div className="relative group opacity-60">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-4xl font-black text-slate-400 dark:text-slate-600">
                $
              </span>
              <input
                type="number"
                disabled
                placeholder="0.00"
                className="w-full bg-transparent border-none focus:ring-0 focus:outline-none outline-none text-5xl sm:text-6xl font-black tracking-tighter p-0 pl-14 placeholder:text-slate-300 dark:placeholder:text-slate-700 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-0" />
            </div>
          </div>
        );
      }

      if (field.type === 'BOOLEAN') {
        return (
          <ChoiceGroup
            label={field.label || `Pregunta ${i + 1}`}
            options={[
              { value: 'true', label: 'Sí' },
              { value: 'false', label: 'No' },
            ]}
            value=""
            onChange={() => {}}
            disabled
            className="w-full"
          />
        );
      }

      if (field.type === 'DATE') {
        return (
          <div className="space-y-2">
            <Label className="font-medium">
              {field.label || `Pregunta ${i + 1}`}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <Button
              variant={'outline'}
              className={cn(
                'w-full h-14 justify-start text-left font-bold text-lg rounded-2xl border-input bg-background hover:bg-accent hover:text-accent-foreground transition-all px-4 text-muted-foreground opacity-50 cursor-not-allowed'
              )}
              disabled
            >
              <Calendar className="mr-3 h-5 w-5 text-muted-foreground" />
              <span>Seleccionar fecha</span>
            </Button>
          </div>
        );
      }

      if (field.type === 'SELECT' || field.type === 'MEMBER_SELECT') {
        const options =
          field.type === 'SELECT'
            ? field.options?.map((o: any) => ({
                value: o.value,
                label: o.value,
              })) || []
            : [
                { value: '1', label: 'Miembro 1' },
                { value: '2', label: 'Miembro 2' },
              ];

        return (
          <ChoiceGroup
            label={field.label || `Pregunta ${i + 1}`}
            options={
              options.length > 0
                ? options
                : [{ value: '', label: 'Sin opciones' }]
            }
            value=""
            onChange={() => {}}
            disabled
            className="w-full"
          />
        );
      }

      if (field.type === 'CYCLE_WEEK_INDICATOR') {
        const verbs = field.options;
        return (
          <CycleWeekIndicator
            label={field.label || 'Semana'}
            startDate={field.value}
            verbs={verbs}
          />
        );
      }

      if (field.type === 'FRIEND_REGISTRATION') {
        return (
          <div className="space-y-4">
            <Label className="font-medium">
              {field.label || 'Registro de Amigos'}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <div className="p-4 border rounded-lg bg-muted/20 space-y-4">
              <div className="text-sm text-muted-foreground text-center">
                Formulario de registro de amigos (Vista Previa)
              </div>
              <Button disabled variant="outline" className="w-full">
                + Agregar Amigo
              </Button>
            </div>
          </div>
        );
      }

      if (field.type === 'MEMBER_ATTENDANCE') {
        return (
          <div className="space-y-4">
            <Label className="font-medium">
              {field.label || 'Asistencia Miembros'}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            <div className="p-4 border rounded-lg bg-muted/20 space-y-4">
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg border bg-background"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4 rounded border border-primary/50" />
                      <span className="text-sm font-medium">
                        Miembro Ejemplo {i}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm text-muted-foreground pt-2 border-t">
                <span>Asistieron: 0</span>
                <span>Faltaron: 3</span>
              </div>
            </div>
          </div>
        );
      }

      return null;
    })();

    if (!content) return null;

    const isNumber = field.type === 'NUMBER' || field.type === 'CURRENCY';

    return (
      <div
        key={i}
        className={cn(
          'bg-card rounded-3xl border-2 border-border shadow-sm transition-all duration-200',
          !isNumber ? 'p-6 sm:p-8' : 'p-4 sm:p-6'
        )}
      >
        {content}
        {field.description && (
          <p className="mt-2 text-sm text-muted-foreground">
            {field.description}
          </p>
        )}
      </div>
    );
  };

  return (
    <Card className="h-full border-none shadow-none bg-transparent">
      <CardContent className="p-0 h-full">
        <div className="flex justify-center px-4 py-6 h-full overflow-y-auto">
          <div className="w-full max-w-lg space-y-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div
                className="h-2 w-full max-w-[200px] rounded-full mb-4"
                style={{ backgroundColor: values.color || '#3b82f6' }}
              />
              <h2 className="text-3xl font-black tracking-tight text-foreground">
                {values.title || 'Título del Reporte'}
              </h2>
              {values.description ? (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {values.description}
                </p>
              ) : (
                <p className="text-muted-foreground/70 italic">
                  Sin descripción
                </p>
              )}
            </div>

            <div className="space-y-4">
              {values.scope === 'CELL' && (
                <div className="bg-card rounded-3xl border-2 border-border shadow-sm p-6">
                  <div className="space-y-2">
                    <Label className="font-medium">Célula</Label>
                    <Input disabled placeholder="Selecciona una célula" />
                  </div>
                </div>
              )}
              {values.scope === 'GROUP' && (
                <div className="bg-card rounded-3xl border-2 border-border shadow-sm p-6">
                  <div className="space-y-2">
                    <Label className="font-medium">Grupo</Label>
                    <Input disabled placeholder="Selecciona un grupo" />
                  </div>
                </div>
              )}
              {values.scope === 'SECTOR' && (
                <div className="bg-card rounded-3xl border-2 border-border shadow-sm p-6">
                  <div className="space-y-2">
                    <Label className="font-medium">Sector</Label>
                    <Input disabled placeholder="Selecciona un sector" />
                  </div>
                </div>
              )}

              {groupedFields.map((group, i) => {
                if (group.section) {
                  const sectionKey = String(
                    group.section.key ||
                      group.section.tempId ||
                      group.section.id ||
                      i
                  );
                  const isOpen = openSections[sectionKey] ?? true;
                  return (
                    <Collapsible
                      key={sectionKey}
                      open={isOpen}
                      onOpenChange={(open) =>
                        setOpenSections((prev) => ({
                          ...prev,
                          [sectionKey]: open,
                        }))
                      }
                      className="bg-muted/30 rounded-3xl border border-border shadow-sm overflow-hidden transition-all duration-300"
                    >
                      <CollapsibleTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full justify-between px-6 py-6 hover:bg-accent/50 transition-colors h-auto whitespace-normal text-left items-start group"
                        >
                          <div className="flex flex-col gap-2 flex-1 mr-4">
                            <span className="text-2xl font-extrabold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent tracking-tight break-words">
                              {group.section.label || 'Sección'}
                            </span>
                            {group.section.description && (
                              <span className="text-base font-medium text-muted-foreground/80 leading-relaxed">
                                {group.section.description}
                              </span>
                            )}
                          </div>
                          <div className="h-8 w-8 rounded-full bg-background/50 group-hover:bg-background flex items-center justify-center border border-primary/20 group-hover:border-primary/40 shadow-sm text-primary transition-all duration-300 shrink-0 mt-1">
                            <ChevronDown
                              className={cn(
                                'h-5 w-5 transition-transform duration-300',
                                isOpen ? 'rotate-180' : ''
                              )}
                            />
                          </div>
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-6 pb-8 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                        <div className="grid grid-cols-1 gap-8 pt-2">
                          {group.fields.map((f, idx) => renderField(f, idx))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                }
                return (
                  <div key={i} className="grid grid-cols-1 gap-8">
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
              <Button disabled className="w-full sm:w-auto h-12 rounded-xl">
                Enviar Reporte
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

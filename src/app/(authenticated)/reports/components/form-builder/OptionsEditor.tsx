import { useFieldArray, Control, UseFormRegister } from "react-hook-form";
import { ReportFormValues } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, X, Plus } from "lucide-react";

export function OptionsEditor({
  nestIndex,
  control,
  register,
  isExpanded,
  onToggle,
}: {
  nestIndex: number;
  control: Control<ReportFormValues>;
  register: UseFormRegister<ReportFormValues>;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `fields.${nestIndex}.options`,
  });

  return (
    <div className="pl-4 border-l-2 border-border ml-1 space-y-2">
      <Button
        type="button"
        variant="ghost"
        className="w-full justify-between px-2"
        onClick={onToggle}
      >
        <span className="text-xs font-semibold uppercase text-muted-foreground">
          Opciones ({fields.length})
        </span>
        {isExpanded ? <ChevronUp /> : <ChevronDown />}
      </Button>

      {isExpanded && (
        <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
          {fields.map((item, k) => (
            <div key={item.id} className="flex gap-2">
              <Input
                {...register(`fields.${nestIndex}.options.${k}.value`, {
                  required: true,
                })}
                placeholder={`Opción ${k + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => remove(k)}
                disabled={fields.length <= 1}
              >
                <X />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={() => append({ value: "" })}
          >
            <Plus className="h-4 w-4" />
            Añadir opción
          </Button>
        </div>
      )}
    </div>
  );
}

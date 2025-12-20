import React, { useState } from "react";
import { useFieldArray, Control, UseFormRegister } from "react-hook-form";
import { ReportFormValues } from "./types";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

export function OptionsEditor({
  nestIndex,
  control,
  register,
}: {
  nestIndex: number;
  control: Control<ReportFormValues>;
  register: UseFormRegister<ReportFormValues>;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { fields, append, remove } = useFieldArray({
    control,
    name: `fields.${nestIndex}.options`,
  });

  return (
    <div className="pl-4 border-l-2 border-base-200 ml-1 space-y-2">
      <div
        className="flex items-center justify-between cursor-pointer hover:bg-base-200/50 p-1 rounded transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <label className="label text-xs font-semibold uppercase text-base-content/50 cursor-pointer">
          Opciones ({fields.length})
        </label>
        <button
          type="button"
          className="btn btn-ghost btn-xs btn-square"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
          {fields.map((item, k) => (
            <div key={item.id} className="flex gap-2">
              <input
                {...register(`fields.${nestIndex}.options.${k}.value`, {
                  required: true,
                })}
                className="input input-bordered input-sm flex-1"
                placeholder={`Opción ${k + 1}`}
              />
              <button
                type="button"
                className="btn btn-ghost btn-xs text-error"
                onClick={() => remove(k)}
                disabled={fields.length <= 1}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-ghost btn-xs gap-1"
            onClick={() => append({ value: "" })}
          >
            <span>+ Añadir opción</span>
          </button>
        </div>
      )}
    </div>
  );
}

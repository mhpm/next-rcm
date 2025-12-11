"use client";

import React from "react";
import {
  Control,
  useFieldArray,
  UseFormRegister,
  FieldErrors,
  useWatch,
} from "react-hook-form";
import { GroupCreateSchema } from "../schema/groups.schema";
import { InputField, SelectField } from "@/components/FormControls";
import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
  useSensors,
  useSensor,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import { RiDeleteBinLine } from "react-icons/ri";

type Props = {
  control: Control<GroupCreateSchema>;
  register: UseFormRegister<GroupCreateSchema>;
  errors: FieldErrors<GroupCreateSchema>;
};

function FieldValueInput({
  control,
  register,
  index,
}: {
  control: Control<GroupCreateSchema>;
  register: UseFormRegister<GroupCreateSchema>;
  index: number;
}) {
  const type = useWatch({ control, name: `fields.${index}.type` });
  if (type === "BOOLEAN") {
    return (
      <SelectField
        name={`fields.${index}.value`}
        label="Valor"
        register={register}
        options={[
          { value: "true", label: "Verdadero" },
          { value: "false", label: "Falso" },
        ]}
      />
    );
  }
  if (type === "DATE") {
    return (
      <InputField
        name={`fields.${index}.value`}
        label="Valor"
        type="date"
        register={register}
      />
    );
  }
  if (type === "NUMBER") {
    return (
      <InputField
        name={`fields.${index}.value`}
        label="Valor"
        type="number"
        register={register}
      />
    );
  }
  return (
    <InputField
      name={`fields.${index}.value`}
      label="Valor"
      register={register}
    />
  );
}

function PaletteItem({
  type,
  label,
  onAdd,
}: {
  type: "TEXT" | "NUMBER" | "BOOLEAN" | "DATE";
  label: string;
  onAdd?: (t: "TEXT" | "NUMBER" | "BOOLEAN" | "DATE") => void;
}) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `palette-${type}`,
    data: { type },
  });
  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      type="button"
      className="btn btn-outline btn-sm w-full justify-start"
      onClick={() => onAdd?.(type)}
    >
      {label}
    </button>
  );
}

function FieldsDroppable({ children }: { children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id: "fields-area" });
  return (
    <div ref={setNodeRef} className="space-y-4">
      {children}
    </div>
  );
}

export default function GroupFieldsEditor({
  control,
  register,
  errors,
}: Props) {
  const { fields, append, remove } = useFieldArray({ control, name: "fields" });
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const [justAddedId, setJustAddedId] = React.useState<string | null>(null);
  const [removingId, setRemovingId] = React.useState<string | null>(null);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active?.data?.current && over?.id === "fields-area") {
      const t = active.data.current.type as
        | "TEXT"
        | "NUMBER"
        | "BOOLEAN"
        | "DATE";
      append({
        key: "",
        label: "",
        type: t,
        value: t === "NUMBER" ? 0 : t === "BOOLEAN" ? "false" : "",
      });
      setTimeout(() => {
        setJustAddedId(fields[fields.length - 1]?.id ?? null);
        setTimeout(() => setJustAddedId(null), 600);
      }, 0);
    }
  };

  const handleAddByClick = (t: "TEXT" | "NUMBER" | "BOOLEAN" | "DATE") => {
    append({
      key: "",
      label: "",
      type: t,
      value: t === "NUMBER" ? 0 : t === "BOOLEAN" ? "false" : "",
    });
    setTimeout(() => {
      setJustAddedId(fields[fields.length - 1]?.id ?? null);
      setTimeout(() => setJustAddedId(null), 600);
    }, 0);
  };

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-base-200 rounded-lg p-4 border border-base-300">
                <h4 className="text-sm font-semibold mb-2">
                  Tipos disponibles
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  <PaletteItem
                    type="TEXT"
                    label="Texto"
                    onAdd={handleAddByClick}
                  />
                  <PaletteItem
                    type="NUMBER"
                    label="Número"
                    onAdd={handleAddByClick}
                  />
                  <PaletteItem
                    type="BOOLEAN"
                    label="Sí/No"
                    onAdd={handleAddByClick}
                  />
                  <PaletteItem
                    type="DATE"
                    label="Fecha"
                    onAdd={handleAddByClick}
                  />
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="card-title text-base">
                    Campos Personalizados
                  </h3>
                </div>
              </div>
              <FieldsDroppable>
                {fields.length === 0 ? (
                  <div className="text-center py-8 bg-base-200/50 rounded-lg border border-dashed border-base-300">
                    <p className="text-sm text-base-content/60 italic">
                      Arrastra un tipo desde la izquierda
                    </p>
                  </div>
                ) : (
                  fields.map((field, index) => (
                    <div
                      key={field.id}
                      className={`p-4 border border-base-300 rounded-lg relative bg-base-50/50 hover:bg-base-100 transition-all ${
                        justAddedId === field.id ? "animate-pulse" : ""
                      } ${removingId === field.id ? "opacity-0 scale-95" : ""}`}
                    >
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs btn-square absolute top-2 right-2 text-error"
                        onClick={() => {
                          setRemovingId(field.id);
                          setTimeout(() => {
                            const idx = fields.findIndex(
                              (f) => f.id === field.id
                            );
                            if (idx >= 0) remove(idx);
                            setRemovingId(null);
                          }, 200);
                        }}
                        title="Eliminar"
                      >
                        <RiDeleteBinLine className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-6">
                        <InputField
                          name={`fields.${index}.key`}
                          label="Clave (ID interno)"
                          register={register}
                          rules={{
                            required: "Requerido",
                            pattern: {
                              value: /^[a-z0-9_]+$/i,
                              message: "Solo letras, números y guion bajo",
                            },
                          }}
                          error={errors.fields?.[index]?.key?.message}
                          placeholder="ej. dia_reunion"
                        />
                        <InputField
                          name={`fields.${index}.label`}
                          label="Etiqueta (Visible)"
                          register={register}
                          rules={{ required: "Requerido" }}
                          error={errors.fields?.[index]?.label?.message}
                          placeholder="ej. Día de Reunión"
                        />
                        <SelectField
                          name={`fields.${index}.type`}
                          label="Tipo de dato"
                          register={register}
                          options={[
                            { value: "TEXT", label: "Texto" },
                            { value: "NUMBER", label: "Número" },
                            { value: "BOOLEAN", label: "Sí/No" },
                            { value: "DATE", label: "Fecha" },
                          ]}
                        />
                        <FieldValueInput
                          index={index}
                          control={control}
                          register={register}
                        />
                      </div>
                    </div>
                  ))
                )}
              </FieldsDroppable>
            </div>
          </div>
        </DndContext>
      </div>
    </div>
  );
}

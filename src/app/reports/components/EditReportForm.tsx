"use client";

import React from "react";
import { useForm, useFieldArray, Control } from "react-hook-form";
import { InputField, SelectField } from "@/components/FormControls";
import type { ReportFieldType, ReportScope } from "@/generated/prisma/client";
import { updateReportWithFields } from "../actions/reports.actions";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "_")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

type FieldItem = {
  id?: string;
  fieldId?: string;
  key: string;
  label?: string;
  type: ReportFieldType;
  value?: unknown;
  options?: { value: string }[];
  required?: boolean;
};

type FormValues = {
  title: string;
  description?: string | null;
  scope: ReportScope;
  fields: FieldItem[];
  color?: string;
};

function OptionsEditor({
  nestIndex,
  control,
  register,
}: {
  nestIndex: number;
  control: Control<FormValues>;
  register: any;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `fields.${nestIndex}.options`,
  });

  return (
    <div className="pl-4 border-l-2 border-base-200 ml-1 space-y-2">
      <label className="label text-xs font-semibold uppercase text-base-content/50">
        Opciones
      </label>
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
  );
}

const COLORS = [
  "#3b82f6", // blue
  "#ef4444", // red
  "#10b981", // green
  "#f59e0b", // orange
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#6366f1", // violet
];

function ColorPicker({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (color: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="label-text font-medium">Color del formulario</label>
      <div className="flex flex-wrap gap-2">
        {COLORS.map((color) => (
          <button
            key={color}
            type="button"
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              selected === color
                ? "border-base-content scale-110"
                : "border-transparent hover:scale-105"
            }`}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
    </div>
  );
}

function SortableField({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    position: "relative",
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

export default function EditReportForm({
  initial,
}: {
  initial: {
    id: string;
    title: string;
    description?: string | null;
    scope: ReportScope;
    fields: FieldItem[];
    color?: string | null;
  };
}) {
  const router = useRouter();
  const {
    control,
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      title: initial.title,
      description: initial.description ?? undefined,
      scope: initial.scope,
      fields: initial.fields,
      color: initial.color || "#3b82f6",
    },
  });
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "fields",
  });

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    })
  );

  const addField = (type: ReportFieldType) => {
    append({
      key: "",
      label: "",
      type,
      value: type === "NUMBER" ? 0 : type === "BOOLEAN" ? "false" : "",
      options:
        type === "SELECT"
          ? [{ value: "Opción 1" }, { value: "Opción 2" }]
          : undefined,
      required: false,
    });
  };

  const duplicateField = (index: number) => {
    const f = fields[index] as any;
    append({
      key: "",
      label: f.label || "",
      type: f.type,
      value: f.value,
      options: f.options ? [...f.options] : undefined,
      required: !!f.required,
    });
  };

  const handleReorderEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) move(oldIndex, newIndex);
  };

  const onSubmit = async (data: FormValues) => {
    const payload = {
      id: initial.id,
      title: data.title,
      description: data.description,
      scope: data.scope,
      color: data.color,
      fields: (data.fields || []).map((f) => ({
        id: f.fieldId, // Usar fieldId como ID de base de datos
        key: f.key,
        label: f.label ?? null,
        type: f.type,
        required: !!f.required,
        value: f.value,
        options: f.options?.map((o) => o.value),
      })),
    };
    await updateReportWithFields(payload);
    router.push("/reports");
  };

  const watched = watch();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="space-y-6">
        <div className="prose max-w-none">
          <h1 className="text-2xl font-bold">Editar reporte</h1>
          <p className="text-base-content/70">
            Actualiza la estructura y preguntas.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body p-5">
              <h3 className="font-semibold text-lg mb-4">
                Configuración General
              </h3>
              <div className="space-y-4">
                <InputField
                  name="title"
                  label="Título del Reporte"
                  register={register}
                  rules={{ required: "Requerido" }}
                />
                <InputField
                  name="description"
                  label="Descripción (Opcional)"
                  register={register}
                />
                <SelectField
                  name="scope"
                  label="Tipo de Entidad"
                  register={register}
                  options={[
                    { value: "CELL", label: "Célula" },
                    { value: "GROUP", label: "Grupo" },
                    { value: "SECTOR", label: "Sector" },
                    { value: "CHURCH", label: "Iglesia" },
                  ]}
                />
                <ColorPicker
                  selected={watched.color || "#3b82f6"}
                  onChange={(color) => setValue("color", color)}
                />
              </div>
            </div>
          </div>

          <div className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body p-5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Preguntas del Reporte</h3>
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-primary btn-sm gap-2"
                  >
                    <span>+ Añadir</span>
                    <span className="text-xs">▼</span>
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    <li>
                      <button type="button" onClick={() => addField("TEXT")}>
                        Texto
                      </button>
                    </li>
                    <li>
                      <button type="button" onClick={() => addField("NUMBER")}>
                        Número
                      </button>
                    </li>
                    <li>
                      <button type="button" onClick={() => addField("BOOLEAN")}>
                        Sí/No
                      </button>
                    </li>
                    <li>
                      <button type="button" onClick={() => addField("DATE")}>
                        Fecha
                      </button>
                    </li>
                    <li>
                      <button type="button" onClick={() => addField("SELECT")}>
                        Opción Múltiple
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <DndContext sensors={sensors} onDragEnd={handleReorderEnd}>
                <SortableContext
                  items={fields.map((f) => f.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <SortableField key={field.id} id={field.id!}>
                        <div className="p-4 border border-base-300 rounded-lg bg-base-50 hover:shadow-sm transition-all group">
                          <div className="flex items-center justify-between mb-3 pb-2 border-b border-base-200">
                            <div className="badge badge-ghost gap-1 cursor-grab active:cursor-grabbing">
                              <span className="opacity-50">☰</span>
                              <span className="text-xs font-medium opacity-70">
                                {field.type === "TEXT" && "Texto"}
                                {field.type === "NUMBER" && "Número"}
                                {field.type === "BOOLEAN" && "Sí/No"}
                                {field.type === "DATE" && "Fecha"}
                                {field.type === "SELECT" && "Opción Múltiple"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                className="btn btn-ghost btn-xs"
                                onClick={() => duplicateField(index)}
                                title="Duplicar"
                              >
                                ⎘
                              </button>
                              <button
                                type="button"
                                className="btn btn-ghost btn-xs text-error"
                                onClick={() => remove(index)}
                                title="Eliminar"
                              >
                                ✕
                              </button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex gap-4">
                              <div className="flex-1">
                                <input
                                  {...register(
                                    `fields.${index}.label` as const,
                                    {
                                      required: true,
                                      onChange: (e) => {
                                        if (!fields[index].fieldId) {
                                          setValue(
                                            `fields.${index}.key`,
                                            slugify(e.target.value)
                                          );
                                        }
                                      },
                                    }
                                  )}
                                  className="input input-bordered input-sm w-full font-medium"
                                  placeholder="Escribe tu pregunta aquí..."
                                />
                              </div>
                              <div className="flex items-center">
                                <label className="label cursor-pointer gap-2">
                                  <span className="label-text text-xs">
                                    Obligatorio
                                  </span>
                                  <input
                                    type="checkbox"
                                    className="toggle toggle-xs"
                                    {...register(
                                      `fields.${index}.required` as const
                                    )}
                                  />
                                </label>
                              </div>
                            </div>

                            {field.type === "SELECT" && (
                              <OptionsEditor
                                nestIndex={index}
                                control={control}
                                register={register}
                              />
                            )}

                            <div className="collapse collapse-arrow border border-base-200 bg-base-100 rounded-md">
                              <input type="checkbox" />
                              <div className="collapse-title text-xs font-medium text-base-content/60 py-2 min-h-0">
                                Opciones avanzadas
                              </div>
                              <div className="collapse-content text-sm">
                                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <InputField
                                    name={`fields.${index}.key`}
                                    label="ID de base de datos (slug)"
                                    register={register}
                                    rules={{ required: "Requerido" }}
                                    defaultValue={fields[index].key}
                                    placeholder={
                                      fields[index].fieldId
                                        ? "Bloqueado"
                                        : "Autogenerado..."
                                    }
                                    className={`input input-bordered input-sm w-full ${
                                      fields[index].fieldId
                                        ? "bg-base-200 text-base-content/60 cursor-not-allowed"
                                        : ""
                                    }`}
                                    readOnly={!!fields[index].fieldId}
                                    tabIndex={
                                      fields[index].fieldId ? -1 : undefined
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </SortableField>
                    ))}
                  </div>
                </SortableContext>

                {fields.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-base-200 rounded-lg bg-base-50">
                    <p className="text-base-content/50">
                      No hay preguntas todavía.
                    </p>
                    <p className="text-sm text-base-content/40 mt-1">
                      Haz clic en "+ Añadir" para comenzar.
                    </p>
                  </div>
                )}
              </DndContext>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-base-200">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => router.push("/reports")}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary px-8"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>{" "}
                  Guardando...
                </>
              ) : (
                "Guardar cambios"
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="hidden lg:block relative h-full">
        <div className="sticky top-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <span className="text-primary">👁</span> Vista Previa
            </h2>
            <span className="badge badge-neutral text-xs">En vivo</span>
          </div>
          <div className="mockup-window border border-base-300 bg-base-200 shadow-xl h-full">
            <div className="flex justify-center px-4 py-8 bg-base-100 h-full overflow-y-auto max-h-[calc(100vh-200px)]">
              <div className="w-full max-w-lg space-y-6">
                <div
                  className="text-center mb-8 border-b border-base-200 pb-6 rounded-t-lg border-t-8"
                  style={{ borderTopColor: watched.color || "#3b82f6" }}
                >
                  <h2 className="text-2xl font-bold text-base-content mt-4">
                    {watched.title || "Título del Reporte"}
                  </h2>
                  {watched.description ? (
                    <p className="text-base-content/70 mt-2">
                      {watched.description}
                    </p>
                  ) : (
                    <p className="text-base-content/30 italic mt-2">
                      Sin descripción
                    </p>
                  )}
                </div>
                <div className="space-y-4">
                  {watched.scope === "CELL" && (
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text font-medium">Célula</span>
                        <span className="label-text-alt text-error">*</span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        disabled
                      >
                        <option>Selecciona una célula</option>
                      </select>
                    </div>
                  )}
                  {watched.scope === "GROUP" && (
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text font-medium">Grupo</span>
                        <span className="label-text-alt text-error">*</span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        disabled
                      >
                        <option>Selecciona un grupo</option>
                      </select>
                    </div>
                  )}
                  {watched.scope === "SECTOR" && (
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text font-medium">Sector</span>
                        <span className="label-text-alt text-error">*</span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        disabled
                      >
                        <option>Selecciona un sector</option>
                      </select>
                    </div>
                  )}

                  {watched.fields?.map((field, i) => (
                    <div
                      key={i}
                      className="form-control w-full p-4 bg-base-50 rounded-lg border border-base-200"
                    >
                      <label className="label">
                        <span className="label-text font-medium">
                          {field.label || `Pregunta ${i + 1}`}
                        </span>
                        {field.required && (
                          <span className="label-text-alt text-error">*</span>
                        )}
                      </label>
                      {field.type === "TEXT" && (
                        <input
                          type="text"
                          className="input input-bordered w-full"
                          placeholder="Tu respuesta"
                          disabled
                        />
                      )}
                      {field.type === "NUMBER" && (
                        <input
                          type="number"
                          className="input input-bordered w-full"
                          placeholder="0"
                          disabled
                        />
                      )}
                      {field.type === "DATE" && (
                        <input
                          type="date"
                          className="input input-bordered w-full"
                          disabled
                        />
                      )}
                      {field.type === "BOOLEAN" && (
                        <select
                          className="select select-bordered w-full"
                          disabled
                        >
                          <option>Selecciona una opción</option>
                          <option>Sí</option>
                          <option>No</option>
                        </select>
                      )}
                    </div>
                  ))}

                  {(!watched.fields || watched.fields.length === 0) && (
                    <div className="text-center py-8 text-base-content/40 border-2 border-dashed border-base-200 rounded-lg">
                      No hay preguntas añadidas
                    </div>
                  )}
                </div>
                <div className="flex justify-end pt-6 border-t border-base-200 mt-8">
                  <button className="btn btn-primary w-full sm:w-auto" disabled>
                    Enviar Reporte
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import {
  Control,
  useFieldArray,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ReportFormValues } from "./types";
import { SortableField } from "./SortableField";
import { FieldEditor } from "./FieldEditor";
import { AddFieldMenu } from "./AddFieldMenu";
import { FieldsEmptyState } from "./FieldsEmptyState";
import { GeneralSettingsForm } from "./GeneralSettingsForm";
import { LivePreview } from "./LivePreview";
import { ReportFieldType } from "@/generated/prisma/client";

interface ReportBuilderProps {
  control: Control<ReportFormValues>;
  register: UseFormRegister<ReportFormValues>;
  watch: UseFormWatch<ReportFormValues>;
  setValue: UseFormSetValue<ReportFormValues>;
}

export function ReportBuilder({
  control,
  register,
  watch,
  setValue,
}: ReportBuilderProps) {
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over?.id);
      move(oldIndex, newIndex);
    }
  };

  const addField = (type: ReportFieldType) => {
    append({
      key: "",
      label: "",
      type,
      value:
        type === "NUMBER" || type === "CURRENCY"
          ? 0
          : type === "BOOLEAN"
          ? "false"
          : "",
      options:
        type === "SELECT"
          ? [{ value: "Opción 1" }, { value: "Opción 2" }]
          : undefined,
      required: false,
    });
  };

  const duplicateField = (index: number) => {
    const f = fields[index];
    append({
      key: "",
      label: f.label || "",
      type: f.type,
      value: f.value,
      options: f.options ? [...f.options] : undefined,
      required: !!f.required,
    });
  };

  const watchedValues = watch();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column: Form Builder */}
      <div className="space-y-6">
        <GeneralSettingsForm
          register={register}
          watch={watch}
          setValue={setValue}
        />

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Campos del Reporte
            </h2>
            <AddFieldMenu onAdd={addField} />
          </div>

          {fields.length === 0 ? (
            <FieldsEmptyState />
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={fields}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <SortableField key={field.id} id={field.id}>
                      <FieldEditor
                        field={field}
                        index={index}
                        register={register}
                        control={control}
                        setValue={setValue}
                        onRemove={remove}
                        onDuplicate={duplicateField}
                      />
                    </SortableField>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {/* Right Column: Preview */}
      <div className="hidden lg:block">
        <div className="sticky top-8">
          <LivePreview values={watchedValues} />
        </div>
      </div>
    </div>
  );
}

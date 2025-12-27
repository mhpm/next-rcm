'use client';

import React from 'react';
import {
  Control,
  useFieldArray,
  UseFormRegister,
  FieldErrors,
  useWatch,
} from 'react-hook-form';
import { GroupCreateSchema } from '../schema/groups.schema';
import { InputField, SelectField } from '@/components/FormControls';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { RiDeleteBinLine, RiDraggable } from 'react-icons/ri';

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
  if (type === 'BOOLEAN') {
    return (
      <SelectField
        name={`fields.${index}.value`}
        label="Valor"
        control={control}
        options={[
          { value: 'true', label: 'Verdadero' },
          { value: 'false', label: 'Falso' },
        ]}
      />
    );
  }
  if (type === 'DATE') {
    return (
      <InputField
        name={`fields.${index}.value`}
        label="Valor"
        type="date"
        register={register}
      />
    );
  }
  if (type === 'NUMBER') {
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
  type: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'DATE';
  label: string;
  onAdd: (t: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'DATE') => void;
}) {
  return (
    <button
      type="button"
      className="btn btn-outline btn-sm w-full justify-start"
      onClick={() => onAdd(type)}
    >
      {label}
    </button>
  );
}

function SortableField({
  id,
  index,
  children,
}: {
  id: string;
  index: number;
  children: React.ReactNode;
}) {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{
            ...provided.draggableProps.style,
            zIndex: snapshot.isDragging ? 50 : undefined,
            marginBottom: '1rem',
          }}
        >
          <div className="relative">
            {/* Drag Handle */}
            <div
              {...provided.dragHandleProps}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 cursor-grab active:cursor-grabbing text-base-content/40 hover:text-base-content z-10"
            >
              <RiDraggable size={20} />
            </div>
            <div className="pl-10">{children}</div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default function GroupFieldsEditor({
  control,
  register,
  errors,
}: Props) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'fields',
  });
  // Removed unused state variables
  // const [justAddedId, setJustAddedId] = React.useState<string | null>(null);
  const [removingId, setRemovingId] = React.useState<string | null>(null);

  const addField = (t: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'DATE') => {
    append({
      key: '',
      label: '',
      type: t,
      value: t === 'NUMBER' ? 0 : t === 'BOOLEAN' ? 'false' : '',
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    move(result.source.index, result.destination.index);
  };

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-base-200 rounded-lg p-4 border border-base-300">
              <h4 className="text-sm font-semibold mb-2">Tipos disponibles</h4>
              <div className="grid grid-cols-1 gap-2">
                <PaletteItem type="TEXT" label="Texto" onAdd={addField} />
                <PaletteItem type="NUMBER" label="Número" onAdd={addField} />
                <PaletteItem type="BOOLEAN" label="Sí/No" onAdd={addField} />
                <PaletteItem type="DATE" label="Fecha" onAdd={addField} />
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="card-title text-base">Campos Personalizados</h3>
              </div>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              {fields.length === 0 ? (
                <div className="text-center py-8 bg-base-200/50 rounded-lg border border-dashed border-base-300">
                  <p className="text-sm text-base-content/60 italic">
                    Haz clic en un tipo de la izquierda para agregarlo
                  </p>
                </div>
              ) : (
                <Droppable droppableId="fields-list">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {fields.map((field, index) => (
                        <SortableField
                          key={field.id}
                          id={field.id}
                          index={index}
                        >
                          <div
                            className={`p-4 border border-base-300 rounded-lg relative bg-base-50/50 hover:bg-base-100 transition-all ${
                              removingId === field.id
                                ? 'opacity-0 scale-95'
                                : ''
                            }`}
                          >
                            <button
                              type="button"
                              className="btn btn-ghost btn-xs btn-square absolute top-2 right-2 text-error"
                              onClick={() => {
                                setRemovingId(field.id);
                                setTimeout(() => {
                                  remove(index);
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
                                  required: 'Requerido',
                                  pattern: {
                                    value: /^[a-z0-9_]+$/i,
                                    message:
                                      'Solo letras, números y guion bajo',
                                  },
                                }}
                                error={errors.fields?.[index]?.key?.message}
                                placeholder="ej. dia_reunion"
                              />
                              <InputField
                                name={`fields.${index}.label`}
                                label="Etiqueta (Visible)"
                                register={register}
                                rules={{ required: 'Requerido' }}
                                error={errors.fields?.[index]?.label?.message}
                                placeholder="ej. Día de Reunión"
                              />
                              <SelectField
                                name={`fields.${index}.type`}
                                label="Tipo de dato"
                                control={control}
                                options={[
                                  { value: 'TEXT', label: 'Texto' },
                                  { value: 'NUMBER', label: 'Número' },
                                  { value: 'BOOLEAN', label: 'Sí/No' },
                                  { value: 'DATE', label: 'Fecha' },
                                ]}
                              />
                              <FieldValueInput
                                index={index}
                                control={control}
                                register={register}
                              />
                            </div>
                          </div>
                        </SortableField>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              )}
            </DragDropContext>
          </div>
        </div>
      </div>
    </div>
  );
}

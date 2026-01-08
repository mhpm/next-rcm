import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Control, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { FieldEditor } from './FieldEditor';
import { ReportFormValues, FieldItem } from './types';

interface SortableFieldProps {
  id: string;
  index: number; // Draggable index
  fieldIndex?: number; // Real index in fields array (if different from index)
  isDragDisabled?: boolean;
  // FieldEditor props
  field: FieldItem;
  register: UseFormRegister<ReportFormValues>;
  control: Control<ReportFormValues>;
  setValue: UseFormSetValue<ReportFormValues>;
  onRemove: (index: number) => void;
  onDuplicate: (index: number) => void;
  advancedExpanded: boolean;
  optionsExpanded: boolean;
  onToggleUi: (id: string, key: 'section' | 'options' | 'advanced') => void;
}

export const SortableField = React.memo(function SortableField({
  id,
  index,
  fieldIndex,
  isDragDisabled = false,
  field,
  register,
  control,
  setValue,
  onRemove,
  onDuplicate,
  advancedExpanded,
  optionsExpanded,
  onToggleUi,
}: SortableFieldProps) {
  // Use fieldIndex if provided, otherwise fallback to index (though fieldIndex should usually be provided)
  const realIndex = fieldIndex !== undefined ? fieldIndex : index;

  return (
    <Draggable draggableId={id} index={index} isDragDisabled={isDragDisabled}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.8 : 1,
            marginBottom: '8px',
          }}
        >
          <FieldEditor
            id={id}
            index={realIndex}
            field={field}
            register={register}
            control={control}
            setValue={setValue}
            onRemove={onRemove}
            onDuplicate={onDuplicate}
            advancedExpanded={advancedExpanded}
            optionsExpanded={optionsExpanded}
            onToggleUi={onToggleUi}
          />
        </div>
      )}
    </Draggable>
  );
});

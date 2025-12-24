import React from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import {
  RiDraggable,
  RiArrowDownSLine,
  RiArrowRightSLine,
} from 'react-icons/ri';
import { Control, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { FieldEditor } from './FieldEditor';
import { SortableField } from './SortableField';
import { ReportFormValues, GroupItem, FieldItem } from './types';
import { Button } from '@/components/ui/button';
import { AddFieldMenu } from './AddFieldMenu';

interface SortableSectionProps {
  id: string;
  index: number;
  group: GroupItem;
  register: UseFormRegister<ReportFormValues>;
  control: Control<ReportFormValues>;
  setValue: UseFormSetValue<ReportFormValues>;
  onRemove: (index: number) => void;
  onDuplicate: (index: number) => void;
  onToggleUi: (id: string, key: 'section' | 'options' | 'advanced') => void;
  getUiState: (id: string, key: 'section' | 'options' | 'advanced') => boolean;
  getStableId: (field: FieldItem) => string;
  onAddFieldToSection: (sectionIndex: number, type: FieldItem['type']) => void;
}

export const SortableSection = React.memo(function SortableSection({
  id,
  index,
  group,
  register,
  control,
  setValue,
  onRemove,
  onDuplicate,
  onToggleUi,
  getUiState,
  getStableId,
  onAddFieldToSection,
}: SortableSectionProps) {
  const isExpanded = getUiState(id, 'section');

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{
            ...provided.draggableProps.style,
            marginBottom: '16px',
            opacity: snapshot.isDragging ? 0.6 : 1,
          }}
          className="border rounded-lg bg-card shadow-sm"
        >
          <div className="flex items-start p-2 bg-muted/50 rounded-t-lg border-b border-border">
            <div
              className="mt-3 mr-2 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
              {...provided.dragHandleProps}
            >
              <RiDraggable size={20} />
            </div>

            <button
              type="button"
              onClick={() => onToggleUi(id, 'section')}
              className="mt-3 mr-2 text-muted-foreground hover:text-foreground transition-colors"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {isExpanded ? (
                <RiArrowDownSLine size={20} />
              ) : (
                <RiArrowRightSLine size={20} />
              )}
            </button>

            <div className="flex-1">
              <FieldEditor
                id={id}
                index={group.index}
                field={group.field}
                register={register}
                control={control}
                setValue={setValue}
                onRemove={onRemove}
                onDuplicate={onDuplicate}
                advancedExpanded={getUiState(id, 'advanced')}
                optionsExpanded={getUiState(id, 'options')}
                onToggleUi={onToggleUi}
              />
            </div>
          </div>

          {isExpanded && (
            <>
              <Droppable droppableId={id} type="ITEM" isDropDisabled={false}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-4 space-y-3 transition-colors ${
                      snapshot.isDraggingOver ? 'bg-primary/5' : 'bg-muted/20'
                    } rounded-b-lg`}
                  >
                    {group.children.map((child, childIndex) => {
                      const childId =
                        getStableId(child.field) || `child_${child.index}`;
                      return (
                        <SortableField
                          key={childId}
                          id={childId}
                          index={childIndex}
                          fieldIndex={child.index}
                          field={child.field}
                          register={register}
                          control={control}
                          setValue={setValue}
                          onRemove={onRemove}
                          onDuplicate={onDuplicate}
                          advancedExpanded={getUiState(childId, 'advanced')}
                          optionsExpanded={getUiState(childId, 'options')}
                          onToggleUi={onToggleUi}
                        />
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <div className="p-4 bg-muted/20 border-t border-border rounded-b-lg">
                <AddFieldMenu
                  onAdd={(type) => onAddFieldToSection(index, type)}
                  className="w-full"
                  trigger={
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="w-full border-dashed text-muted-foreground hover:text-primary"
                    >
                      <span className="text-lg">+</span>
                      <span>Agregar Campo</span>
                    </Button>
                  }
                />
              </div>
            </>
          )}
        </div>
      )}
    </Draggable>
  );
});

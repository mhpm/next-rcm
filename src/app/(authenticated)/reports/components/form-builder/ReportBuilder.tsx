'use client';

import React from 'react';
import {
  Control,
  useFieldArray,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
  pointerWithin,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ReportFormValues } from './types';
import { SortableField } from './SortableField';
import { FieldEditor } from './FieldEditor';
import { AddFieldMenu } from './AddFieldMenu';
import { FieldsEmptyState } from './FieldsEmptyState';
import { GeneralSettingsForm } from './GeneralSettingsForm';
import { LivePreview } from './LivePreview';
import { ReportFieldType } from '@/generated/prisma/client';

import { SortableSection } from './SortableSection';
import { generateTempId } from './utils';
import { DropZone, BottomDropZone } from './DropZone';

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
  const { fields, append, remove, move, replace } = useFieldArray({
    control,
    name: 'fields',
  });

  const getStableId = React.useCallback((field: any) => {
    return field.fieldId || field.tempId || field.id;
  }, []);

  // UI State for expanded/collapsed items
  const [uiState, setUiState] = React.useState<
    Record<
      string,
      {
        section?: boolean;
        options?: boolean;
        advanced?: boolean;
      }
    >
  >(() => {
    if (typeof window !== 'undefined') {
      const key = `report-builder-ui-state-${window.location.pathname}`;
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (e) {
        console.error('Failed to load ui state', e);
      }
    }
    return {};
  });

  // Persist UI State
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const key = `report-builder-ui-state-${window.location.pathname}`;
      localStorage.setItem(key, JSON.stringify(uiState));
    }
  }, [uiState]);

  const toggleUiState = (
    id: string,
    key: 'section' | 'options' | 'advanced'
  ) => {
    setUiState((prev) => {
      const current = prev[id]?.[key];
      // Defaults:
      // Section: true
      // Options: true
      // Advanced: false
      const defaultValue = key === 'advanced' ? false : true;
      const newValue = current === undefined ? !defaultValue : !current;

      return {
        ...prev,
        [id]: {
          ...prev[id],
          [key]: newValue,
        },
      };
    });
  };

  const getUiState = (
    id: string | undefined,
    key: 'section' | 'options' | 'advanced'
  ) => {
    if (!id) {
      // Should not happen with tempId, but fallback
      if (key === 'advanced') return false;
      return true;
    }
    const val = uiState[id]?.[key];
    if (val !== undefined) return val;
    // Defaults
    if (key === 'advanced') return false;
    return true;
  };

  // Ensure all fields have a tempId (for existing fields)
  React.useEffect(() => {
    let hasMissingTempId = false;
    fields.forEach((f) => {
      if (!f.tempId) hasMissingTempId = true;
    });

    if (hasMissingTempId) {
      const newFields = fields.map((f) => ({
        ...f,
        tempId: f.tempId || generateTempId(),
      }));
      // We use replace to update the fields with tempIds,
      // but we need to be careful not to trigger loops if replace causes re-render that triggers effect.
      // However, fields dependency will update.
      // But we only map if missing.
      replace(newFields);
    }
  }, [fields, replace]); // Depend on fields to catch updates, but condition prevents loop

  // Group fields by section for rendering
  const groupedFields = React.useMemo(() => {
    const groups: {
      id: string; // Use tempId for UI stability
      type: 'SECTION' | 'FIELD';
      field: any;
      index: number;
      children: { field: any; index: number }[];
    }[] = [];

    let currentSection: (typeof groups)[0] | null = null;

    fields.forEach((field, index) => {
      // Use stableId for UI stability
      const stableId = getStableId(field) || `fallback_${index}`;

      if (field.type === 'SECTION') {
        currentSection = {
          id: stableId,
          type: 'SECTION',
          field,
          index,
          children: [],
        };
        groups.push(currentSection);
      } else {
        if (currentSection) {
          currentSection.children.push({ field, index });
        } else {
          groups.push({
            id: stableId,
            type: 'FIELD',
            field,
            index,
            children: [],
          });
        }
      }
    });

    return groups;
  }, [fields, getStableId]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    })
  );

  const [activeId, setActiveId] = React.useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    // Handle DropZone drops
    let targetIndex = -1;
    let isBottomDropZone = false;

    if (over.id === 'bottom-drop-zone') {
      targetIndex = fields.length;
      isBottomDropZone = true;
    } else if (
      typeof over.id === 'string' &&
      over.id.startsWith('drop-zone-')
    ) {
      // Format: drop-zone-INDEX or drop-zone-inside-INDEX
      const parts = over.id.split('-');
      // last part is index
      targetIndex = parseInt(parts[parts.length - 1], 10);
    }

    if (targetIndex !== -1) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const activeField = fields[oldIndex];

      // Handle Section Block Move
      if (activeField.type === 'SECTION') {
        // Calculate block size
        let blockSize = 1;
        for (let i = oldIndex + 1; i < fields.length; i++) {
          if (fields[i].type === 'SECTION') break;
          blockSize++;
        }

        const newFields = [...fields];
        const chunk = newFields.splice(oldIndex, blockSize);

        // Adjust insertion point
        let insertAt = targetIndex;
        if (oldIndex < targetIndex) {
          insertAt = targetIndex - blockSize;
          if (insertAt < 0) insertAt = 0;
        }

        newFields.splice(insertAt, 0, ...chunk);
        replace(newFields);
        return;
      }

      // Single Field Move

      // Special logic for Bottom Drop Zone: Break out of section
      if (isBottomDropZone) {
        // Remove the field first to see the state of the list "without it"
        const newFields = [...fields];
        const [movedField] = newFields.splice(oldIndex, 1);

        // Now check if the last item in the remaining list is inside a section
        let lastItemIsInSection = false;
        // Iterate backwards to find the first section
        for (let i = newFields.length - 1; i >= 0; i--) {
          if (newFields[i].type === 'SECTION') {
            lastItemIsInSection = true;
            break;
          }
        }

        if (lastItemIsInSection) {
          // Insert a new Section Break
          newFields.push({
            id: generateTempId(),
            key: '',
            label: 'Nueva Sección',
            type: 'SECTION',
            tempId: generateTempId(),
            value: '',
            required: false,
          });
        }

        // Append the field
        newFields.push(movedField);
        replace(newFields);
        return;
      }

      // Standard Move (Drop Zones)
      let finalIndex = targetIndex;
      if (oldIndex < targetIndex) {
        finalIndex = targetIndex - 1;
      }

      move(oldIndex, finalIndex);
      return;
    }

    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);

    const activeField = fields[oldIndex];
    const overField = fields[newIndex];

    if (activeField.type === 'SECTION') {
      // Move SECTION BLOCK (Header + Children)
      // ... (existing section move logic)

      // If dropping over Bottom Drop Zone
      if (over.id === 'bottom-drop-zone') {
        // Move section block to end
        // ... implementation for section block move to end
        // Actually, let's keep it simple: just move the header index to end?
        // No, we need to move the whole block.

        const newFields = [...fields];
        let blockSize = 1;
        for (let i = oldIndex + 1; i < fields.length; i++) {
          if (fields[i].type === 'SECTION') break;
          blockSize++;
        }
        const chunk = newFields.splice(oldIndex, blockSize);
        newFields.push(...chunk);
        replace(newFields);
        return;
      }

      // 1. Calculate block size
      let blockSize = 1;
      for (let i = oldIndex + 1; i < fields.length; i++) {
        if (fields[i].type === 'SECTION') break;
        blockSize++;
      }

      // 2. Identify target insertion point
      // If dropping over a Section, we want to swap positions with that section block?
      // Or insert before/after?
      // dnd-kit gives us the index in the SORTABLE context.
      // But we are working with flat indices here.

      // We need to move the chunk [oldIndex, oldIndex + blockSize] to newIndex.
      // But newIndex might be inside another block or shifted.

      // Let's use a simpler logic:
      // Remove the block.
      // Insert it at the new index (adjusted for removal).

      const newFields = [...fields];
      const chunk = newFields.splice(oldIndex, blockSize);

      // Adjust newIndex if we removed from before it
      let insertAt = newIndex;
      if (oldIndex < newIndex) {
        // If we move down, the target index shifts up by blockSize?
        // No, 'newIndex' is the index of the item we dropped OVER.
        // If we dropped over an item that was at index 10, and we removed 3 items from index 0.
        // That item is now at index 7.
        // So we want to insert at 7? Or after it?

        // Let's rely on the ID map.
        // Find index of 'over.id' in the *modified* array (after removal).
        const overIndexAfterRemove = newFields.findIndex(
          (f) => f.id === over.id
        );

        // If moving down, we usually want to place AFTER the target?
        // dnd-kit standard behavior: replace target.
        insertAt = overIndexAfterRemove;

        // Special case: if we drop over a section header that is 'below', we probably want to swap.
        // If we drop over a child, we insert into that section?
        // Let's just insert AT the target index.
      } else {
        // Moving up.
        const overIndexAfterRemove = newFields.findIndex(
          (f) => f.id === over.id
        );
        insertAt = overIndexAfterRemove;
      }

      newFields.splice(insertAt, 0, ...chunk);
      replace(newFields);
    } else {
      // Move Single Field
      if (over.id === 'bottom-drop-zone') {
        move(oldIndex, fields.length - 1);
        return;
      }

      // If moving into a section, or out of a section, simple move works because
      // sections are defined by order.
      // move(oldIndex, newIndex); // This relies on internal IDs which might be regen'd.
      // Better to use replace to be consistent?
      // No, move is fine if we are not replacing whole array manually.
      // But we are using 'replace' for sections.
      // Let's stick to move for single fields.
      move(oldIndex, newIndex);
    }
  };

  const addField = (type: ReportFieldType) => {
    append({
      key: '',
      label: '',
      type,
      tempId: generateTempId(),
      value:
        type === 'NUMBER' || type === 'CURRENCY'
          ? 0
          : type === 'BOOLEAN'
          ? 'false'
          : '',
      options:
        type === 'SELECT'
          ? [{ value: 'Opción 1' }, { value: 'Opción 2' }]
          : undefined,
      required: false,
    });
  };

  const duplicateField = (index: number) => {
    const f = fields[index];
    append({
      key: '',
      label: f.label || '',
      type: f.type,
      tempId: generateTempId(),
      value: f.value,
      options: f.options ? [...f.options] : undefined,
      required: !!f.required,
    });
  };

  const watchedValues = watch();

  const [activeTab, setActiveTab] = React.useState<'general' | 'fields'>(
    'general'
  );

  const activeField = activeId ? fields.find((f) => f.id === activeId) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column: Form Builder */}
      <div className="space-y-6">
        {/* Tabs */}
        <div role="tablist" className="tabs tabs-border bg-base-200 p-1">
          <a
            role="tab"
            className={`tab ${activeTab === 'general' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            Configuración General
          </a>
          <a
            role="tab"
            className={`tab ${activeTab === 'fields' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('fields')}
          >
            Campos del Reporte
          </a>
        </div>

        <div className={activeTab === 'general' ? 'block' : 'hidden'}>
          <GeneralSettingsForm
            register={register}
            watch={watch}
            setValue={setValue}
          />
        </div>

        <div
          className={`bg-base-100 p-6 rounded-sm shadow-sm border border-base-300 ${
            activeTab === 'fields' ? 'block' : 'hidden'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-base-content">
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
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              <SortableContext
                items={fields}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  <DropZone id="drop-zone-0" isDragging={!!activeId} />
                  {groupedFields.map((group) => {
                    if (group.type === 'SECTION') {
                      return (
                        <SortableSection
                          key={group.id}
                          id={group.field.id}
                          isExpanded={getUiState(
                            getStableId(group.field),
                            'section'
                          )}
                          onToggle={() =>
                            toggleUiState(
                              getStableId(group.field) || '',
                              'section'
                            )
                          }
                          header={
                            <FieldEditor
                              field={group.field}
                              index={group.index}
                              register={register}
                              control={control}
                              setValue={setValue}
                              onRemove={remove}
                              onDuplicate={duplicateField}
                              advancedExpanded={getUiState(
                                getStableId(group.field),
                                'advanced'
                              )}
                              onToggleAdvanced={() =>
                                toggleUiState(
                                  getStableId(group.field) || '',
                                  'advanced'
                                )
                              }
                              optionsExpanded={getUiState(
                                getStableId(group.field),
                                'options'
                              )}
                              onToggleOptions={() =>
                                toggleUiState(
                                  getStableId(group.field) || '',
                                  'options'
                                )
                              }
                            />
                          }
                        >
                          <div className="space-y-4">
                            <DropZone
                              id={`drop-zone-${group.index + 1}`}
                              isDragging={!!activeId}
                            />
                            {group.children.map((child) => (
                              <React.Fragment
                                key={child.field.tempId || child.field.id}
                              >
                                <SortableField id={child.field.id}>
                                  <FieldEditor
                                    field={child.field}
                                    index={child.index}
                                    register={register}
                                    control={control}
                                    setValue={setValue}
                                    onRemove={remove}
                                    onDuplicate={duplicateField}
                                    advancedExpanded={getUiState(
                                      getStableId(child.field),
                                      'advanced'
                                    )}
                                    onToggleAdvanced={() =>
                                      toggleUiState(
                                        getStableId(child.field) || '',
                                        'advanced'
                                      )
                                    }
                                    optionsExpanded={getUiState(
                                      getStableId(child.field),
                                      'options'
                                    )}
                                    onToggleOptions={() =>
                                      toggleUiState(
                                        getStableId(child.field) || '',
                                        'options'
                                      )
                                    }
                                  />
                                </SortableField>
                                <DropZone
                                  id={`drop-zone-${child.index + 1}`}
                                  isDragging={!!activeId}
                                />
                              </React.Fragment>
                            ))}
                            {group.children.length === 0 && (
                              <div className="text-center p-4 border-2 border-dashed border-base-200 rounded text-base-content/30 text-sm">
                                Arrastra campos aquí
                              </div>
                            )}
                          </div>
                        </SortableSection>
                      );
                    }
                    return (
                      <React.Fragment key={group.id}>
                        <SortableField id={group.field.id}>
                          <FieldEditor
                            field={group.field}
                            index={group.index}
                            register={register}
                            control={control}
                            setValue={setValue}
                            onRemove={remove}
                            onDuplicate={duplicateField}
                            advancedExpanded={getUiState(
                              getStableId(group.field),
                              'advanced'
                            )}
                            onToggleAdvanced={() =>
                              toggleUiState(
                                getStableId(group.field) || '',
                                'advanced'
                              )
                            }
                            optionsExpanded={getUiState(
                              getStableId(group.field),
                              'options'
                            )}
                            onToggleOptions={() =>
                              toggleUiState(
                                getStableId(group.field) || '',
                                'options'
                              )
                            }
                          />
                        </SortableField>
                        <DropZone
                          id={`drop-zone-${group.index + 1}`}
                          isDragging={!!activeId}
                        />
                      </React.Fragment>
                    );
                  })}
                </div>
              </SortableContext>

              <BottomDropZone id="bottom-drop-zone" />

              <DragOverlay>
                {activeField ? (
                  <div className="bg-base-100 p-4 rounded shadow-lg border border-primary w-full max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">
                        {activeField.label || 'Campo sin nombre'}
                      </span>
                      <span className="badge badge-sm">{activeField.type}</span>
                    </div>
                  </div>
                ) : null}
              </DragOverlay>

              <div className="flex justify-center mt-6 pt-6 border-t border-dashed border-base-300">
                <AddFieldMenu onAdd={addField} className="dropdown-top" />
              </div>
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

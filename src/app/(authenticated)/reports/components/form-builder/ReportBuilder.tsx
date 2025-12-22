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
    return field.key || field.fieldId || field.tempId || field.id;
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

  const SECTION_BREAK_VALUE = 'SECTION_BREAK';

  // Group fields by section for rendering
  const groupedFields = React.useMemo(() => {
    const groups: {
      id: string; // Use tempId for UI stability
      type: 'SECTION' | 'FIELD';
      field: any;
      index: number;
      children: { field: any; index: number }[];
      endIndex: number; // Track the last index covered by this group
    }[] = [];

    let currentSection: (typeof groups)[0] | null = null;

    fields.forEach((field, index) => {
      // Use stableId for UI stability
      const stableId = getStableId(field) || `fallback_${index}`;

      if (field.type === 'SECTION') {
        if (field.value === SECTION_BREAK_VALUE) {
          // This is a break, close the current section
          currentSection = null;
          // We do not render this field
          return;
        }

        currentSection = {
          id: stableId,
          type: 'SECTION',
          field,
          index,
          children: [],
          endIndex: index,
        };
        groups.push(currentSection);
      } else {
        if (currentSection) {
          currentSection.children.push({ field, index });
          currentSection.endIndex = index;
        } else {
          groups.push({
            id: stableId,
            type: 'FIELD',
            field,
            index,
            children: [],
            endIndex: index,
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

    // Helper to check if an index is "inside" a section
    const isInsideSection = (list: any[], index: number) => {
      for (let i = index; i >= 0; i--) {
        const f = list[i];
        if (f.type === 'SECTION') {
          return f.value !== SECTION_BREAK_VALUE;
        }
      }
      return false;
    };

    // Handle DropZone drops
    let targetIndex = -1;
    let isBottomDropZone = false;
    let isRootDropZone = false;

    if (over.id === 'bottom-drop-zone') {
      targetIndex = fields.length;
      isBottomDropZone = true;
    } else if (typeof over.id === 'string') {
      if (over.id.startsWith('drop-zone-inside-')) {
        const parts = over.id.split('-');
        targetIndex = parseInt(parts[parts.length - 1], 10);
      } else if (over.id.startsWith('drop-zone-root-')) {
        const parts = over.id.split('-');
        targetIndex = parseInt(parts[parts.length - 1], 10);
        isRootDropZone = true;
      } else if (over.id.startsWith('drop-zone-')) {
        // Fallback for initial/legacy IDs (like drop-zone-0)
        const parts = over.id.split('-');
        targetIndex = parseInt(parts[parts.length - 1], 10);
        // drop-zone-0 is always root
        if (targetIndex === 0) isRootDropZone = true;
      }
    }

    if (targetIndex !== -1) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const activeField = fields[oldIndex];

      // Handle Section Block Move
      if (
        activeField.type === 'SECTION' &&
        activeField.value !== SECTION_BREAK_VALUE
      ) {
        // Calculate block size
        let blockSize = 1;
        for (let i = oldIndex + 1; i < fields.length; i++) {
          const f = fields[i];
          if (f.type === 'SECTION' && f.value !== SECTION_BREAK_VALUE) break;
          // Note: If we hit a BREAK, we should include it?
          // If we move a section, we move everything until the next SECTION starts.
          // A BREAK ends the section. So we should include the BREAK in the block?
          // If we include the BREAK, then the section "closes" itself wherever it goes.
          // Yes, include BREAK.
          // But wait, if we hit a proper SECTION, stop.
          blockSize++;
          // If it was a BREAK, we stop AFTER it?
          // Actually, if we hit a BREAK, that's the end of this section's scope.
          // So the next item is Root.
          // So we should include the BREAK.
          if (f.type === 'SECTION' && f.value === SECTION_BREAK_VALUE) {
            break; // Loop increments blockSize then breaks?
            // No, simple logic:
            // A section block ends when:
            // 1. Another real SECTION starts.
            // 2. End of list.
            // 3. A BREAK? A break belongs to the section?
            // Yes, a break belongs to the section it closes.
          }
        }

        // Refined block size logic:
        // Iterate and count until we find a real SECTION.
        // BREAKs are part of the content flow (they end the section).
        blockSize = 1;
        for (let i = oldIndex + 1; i < fields.length; i++) {
          if (
            fields[i].type === 'SECTION' &&
            fields[i].value !== SECTION_BREAK_VALUE
          )
            break;
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
      const newFields = [...fields];
      const [movedField] = newFields.splice(oldIndex, 1);

      // Adjust insertion point after removal
      let insertAt = targetIndex;
      if (oldIndex < targetIndex) {
        insertAt = targetIndex - 1;
      }

      // Check if we need to insert a break
      // Only if moving a non-section field to a Root/Bottom zone
      // AND the insertion point is currently "inside" a section
      if (
        (isBottomDropZone || isRootDropZone) &&
        activeField.type !== 'SECTION'
      ) {
        // Check item at insertAt - 1
        const prevIndex = insertAt - 1;
        if (prevIndex >= 0 && isInsideSection(newFields, prevIndex)) {
          // Insert BREAK
          newFields.splice(insertAt, 0, {
            id: generateTempId(),
            key: `break_${generateTempId()}`,
            label: 'Section Break',
            type: 'SECTION',
            tempId: generateTempId(),
            value: SECTION_BREAK_VALUE,
            required: false,
          });
          insertAt++; // Shift insert point for the field
        }
      }

      newFields.splice(insertAt, 0, movedField);
      replace(newFields);
      return;
    }

    // Sortable Move (dragging over another item)
    // We should treat this as a move to the index of 'over'.
    // But dnd-kit gives us IDs.
    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);

    // If simply sorting within the list, we assume the user knows what they are doing.
    // But if we drag "out" of a section visually (which is handled by DropZones usually),
    // this fallback is for when we drag DIRECTLY over an item.
    // If we drag over an item, we replace it / swap.
    // Standard move() is fine here.
    move(oldIndex, newIndex);
  };

  const addField = (type: ReportFieldType) => {
    // Check if the last item is in a section
    let inSection = false;
    for (let i = fields.length - 1; i >= 0; i--) {
      const f = fields[i];
      if (f.type === 'SECTION') {
        if (f.value !== SECTION_BREAK_VALUE) {
          inSection = true;
        }
        break;
      }
    }

    const newField = {
      key: `field_${generateTempId()}`,
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
    };

    if (inSection) {
      // Append BREAK first
      append([
        {
          key: `break_${generateTempId()}`,
          label: 'Section Break',
          type: 'SECTION',
          tempId: generateTempId(),
          value: SECTION_BREAK_VALUE,
          required: false,
        },
        newField,
      ]);
    } else {
      append(newField);
    }
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
                  <DropZone id="drop-zone-root-0" isDragging={!!activeId} />
                  {groupedFields.map((group) => {
                    if (group.type === 'SECTION') {
                      return (
                        <React.Fragment key={group.id}>
                          <SortableSection
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
                                id={`drop-zone-inside-${group.index + 1}`}
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
                                    id={`drop-zone-inside-${child.index + 1}`}
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
                          <DropZone
                            id={`drop-zone-root-${group.endIndex + 1}`}
                            isDragging={!!activeId}
                          />
                        </React.Fragment>
                      );
                    }

                    // Root Field
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
                          id={`drop-zone-root-${group.endIndex + 1}`}
                          isDragging={!!activeId}
                        />
                      </React.Fragment>
                    );
                  })}
                  <BottomDropZone
                    id="bottom-drop-zone"
                    isDragging={!!activeId}
                  />
                </div>
              </SortableContext>

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

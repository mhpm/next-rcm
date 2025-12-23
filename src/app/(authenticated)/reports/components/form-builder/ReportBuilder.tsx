'use client';

import React from 'react';
import {
  Control,
  useFieldArray,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
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
import { BottomDropZone } from './DropZone';

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
  const { fields, append, remove, replace, insert } = useFieldArray({
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
      // Section: true (expanded)
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
      if (key === 'advanced') return false;
      return true;
    }
    const val = uiState[id]?.[key];
    if (val !== undefined) return val;
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
      replace(newFields);
    }
  }, [fields, replace]);

  const SECTION_BREAK_VALUE = 'SECTION_BREAK';

  // Group fields by section for rendering
  const groupedFields = React.useMemo(() => {
    const groups: {
      id: string;
      type: 'SECTION' | 'FIELD';
      field: any;
      index: number;
      children: { field: any; index: number }[];
      endIndex: number;
    }[] = [];

    let currentSection: (typeof groups)[0] | null = null;

    fields.forEach((field, index) => {
      const stableId = getStableId(field) || `fallback_${index}`;

      if (field.type === 'SECTION') {
        if (field.value === SECTION_BREAK_VALUE) {
          currentSection = null;
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
  }, [fields, getStableId, SECTION_BREAK_VALUE]);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Determine Source Range
    let sourceStartIndex = -1;
    let sourceEndIndex = -1;

    if (source.droppableId === 'ROOT') {
      const group = groupedFields[source.index];
      if (!group) return;

      sourceStartIndex = group.index;
      sourceEndIndex = group.endIndex;

      // If it's a section, check if there's a break after it to include
      if (group.type === 'SECTION') {
        const nextField = fields[group.endIndex + 1];
        if (nextField && nextField.value === SECTION_BREAK_VALUE) {
          sourceEndIndex = group.endIndex + 1;
        }
      }
    } else {
      // Moving a child field from a section
      const group = groupedFields.find((g) => g.id === source.droppableId);
      if (!group) return;
      // children[source.index] corresponds to fields[group.index + 1 + source.index]
      sourceStartIndex = group.index + 1 + source.index;
      sourceEndIndex = sourceStartIndex;
    }

    // Determine Destination Index (in current array)
    let destIndex = -1;
    let needsBreak = false;

    if (destination.droppableId === 'bottom-drop-zone') {
      destIndex = fields.length;
    } else if (destination.droppableId === 'ROOT') {
      let targetGroupIndex = destination.index - 1;

      // When moving an item down within the same list, we need to insert *after* the item
      // that is currently at the destination index, because the source item will be removed.
      if (source.droppableId === 'ROOT' && source.index < destination.index) {
        targetGroupIndex = destination.index;
      }

      if (targetGroupIndex < 0) {
        destIndex = 0;
      } else {
        // Insert after group at targetGroupIndex
        const prevGroup = groupedFields[targetGroupIndex];
        if (!prevGroup) {
          destIndex = fields.length;
        } else {
          // Standard insertion point
          destIndex = prevGroup.endIndex + 1;

          // Check if we are inserting after a Section that needs a break
          if (prevGroup.type === 'SECTION') {
            const nextField = fields[destIndex];
            // If the next field is a break, we insert after it
            if (nextField && nextField.value === SECTION_BREAK_VALUE) {
              destIndex += 1;
            } else {
              // No break exists. We need to insert one.
              needsBreak = true;
            }
          }
        }
      }
    } else {
      // Dropping into a section
      const group = groupedFields.find((g) => g.id === destination.droppableId);
      if (!group) return;
      destIndex = group.index + 1 + destination.index;
    }

    // Perform the Move
    // 1. Extract items
    const itemsToMove = fields.slice(sourceStartIndex, sourceEndIndex + 1);

    // 2. Remove items from array
    const fieldsWithoutItems = [...fields];
    fieldsWithoutItems.splice(sourceStartIndex, itemsToMove.length);

    // 3. Adjust destIndex if removal affected it
    // If insertion point was after removal point, we need to shift it down
    let finalDestIndex = destIndex;
    if (sourceStartIndex < destIndex) {
      finalDestIndex = destIndex - itemsToMove.length;
    }

    // 4. Insert items
    const newFields = [...fieldsWithoutItems];
    newFields.splice(finalDestIndex, 0, ...itemsToMove);

    // 5. Handle Break Insertion
    if (needsBreak) {
      newFields.splice(finalDestIndex, 0, {
        id: generateTempId(),
        tempId: generateTempId(),
        type: 'SECTION',
        label: 'Section Break',
        key: `break_${Date.now()}`,
        value: SECTION_BREAK_VALUE,
        required: false,
        order: 0,
        options: [],
        validation: {},
      } as any);
    }

    replace(newFields);
  };

  const addField = (type: ReportFieldType) => {
    // Add to end of list
    const newField = {
      id: generateTempId(),
      tempId: generateTempId(),
      type,
      label: type === 'SECTION' ? 'Nueva Sección' : 'Nuevo Campo',
      key: `${type.toLowerCase()}_${Date.now()}`,
      required: false,
      order: fields.length,
      options: [],
      validation: {},
    };

    const lastGroup = groupedFields[groupedFields.length - 1];
    let itemsToAdd: any[] = [newField];

    if (lastGroup && lastGroup.type === 'SECTION') {
      const lastField = fields[fields.length - 1];
      if (lastField.value !== SECTION_BREAK_VALUE) {
        itemsToAdd = [
          {
            id: generateTempId(),
            tempId: generateTempId(),
            type: 'SECTION',
            label: 'Section Break',
            key: `break_${Date.now()}`,
            value: SECTION_BREAK_VALUE,
            required: false,
            order: 0,
            options: [],
            validation: {},
          },
          newField,
        ];
      }
    }

    append(itemsToAdd);

    if (type === 'SECTION') {
      toggleUiState(newField.tempId, 'section');
    }
  };

  const addFieldToSection = (sectionIndex: number, type: ReportFieldType) => {
    const group = groupedFields[sectionIndex];
    if (!group) return;

    const newField = {
      id: generateTempId(),
      tempId: generateTempId(),
      type,
      label: type === 'SECTION' ? 'Nueva Sección' : 'Nuevo Campo',
      key: `${type.toLowerCase()}_${Date.now()}`,
      required: false,
      order: 0, // Order will be handled by array position
      options: [],
      validation: {},
    };

    // Insert after the last child of the section
    // group.endIndex is the index of the last child (or the section header if no children)
    insert(group.endIndex + 1, newField);

    if (type === 'SECTION') {
      toggleUiState(newField.tempId, 'section');
    }
  };

  const duplicateField = (index: number) => {
    const field = fields[index];
    const newField = {
      ...field,
      id: generateTempId(),
      tempId: generateTempId(),
      key: `${field.key}_copy_${Date.now()}`,
      label: `${field.label} (Copia)`,
    };
    insert(index + 1, newField);
  };

  const [activeTab, setActiveTab] = React.useState<
    'settings' | 'fields' | 'preview'
  >('settings');
  const [isDragging, setIsDragging] = React.useState(false);
  const values = watch();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column: Form Builder */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Constructor de Reporte</h2>
          {activeTab === 'fields' && <AddFieldMenu onAdd={addField} />}
        </div>

        <div role="tablist" className="tabs tabs-boxed mb-4">
          <a
            role="tab"
            className={`tab ${activeTab === 'settings' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('settings')}
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
          <a
            role="tab"
            className={`tab lg:hidden ${
              activeTab === 'preview' ? 'tab-active' : ''
            }`}
            onClick={() => setActiveTab('preview')}
          >
            Vista Previa
          </a>
        </div>

        {activeTab === 'settings' && (
          <GeneralSettingsForm
            control={control}
            register={register}
            watch={watch}
            setValue={setValue}
          />
        )}

        {activeTab === 'fields' && (
          <>
            {fields.length === 0 ? (
              <FieldsEmptyState />
            ) : (
              <DragDropContext
                onDragStart={() => setIsDragging(true)}
                onDragEnd={(result) => {
                  setIsDragging(false);
                  handleDragEnd(result);
                }}
              >
                <div className="space-y-4">
                  <Droppable droppableId="ROOT" type="GROUP">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="min-h-12.5"
                      >
                        {groupedFields.map((group, index) => (
                          <React.Fragment key={group.id}>
                            {group.type === 'SECTION' ? (
                              <SortableSection
                                id={group.id}
                                index={index}
                                header={
                                  <FieldEditor
                                    field={group.field}
                                    index={group.index}
                                    register={register}
                                    control={control}
                                    setValue={setValue}
                                    onRemove={() => remove(group.index)}
                                    onDuplicate={() =>
                                      duplicateField(group.index)
                                    }
                                    advancedExpanded={getUiState(
                                      group.id,
                                      'advanced'
                                    )}
                                    onToggleAdvanced={() =>
                                      toggleUiState(group.id, 'advanced')
                                    }
                                    optionsExpanded={getUiState(
                                      group.id,
                                      'options'
                                    )}
                                    onToggleOptions={() =>
                                      toggleUiState(group.id, 'options')
                                    }
                                  />
                                }
                                isExpanded={getUiState(group.id, 'section')}
                                onToggle={() =>
                                  toggleUiState(group.id, 'section')
                                }
                                isDropDisabled={false}
                                footer={
                                  <AddFieldMenu
                                    onAdd={(type) =>
                                      addFieldToSection(index, type)
                                    }
                                    className="dropdown-top w-full"
                                    trigger={
                                      <div className="btn btn-ghost btn-sm w-full border border-dashed border-base-300 hover:border-primary hover:bg-base-100 text-base-content/50 hover:text-primary flex gap-2 normal-case transition-all">
                                        <span className="text-lg">+</span>
                                        <span>Agregar Campo</span>
                                      </div>
                                    }
                                  />
                                }
                              >
                                {group.children.map((child, childIndex) => (
                                  <SortableField
                                    key={
                                      getStableId(child.field) ||
                                      `child_${child.index}`
                                    }
                                    id={
                                      getStableId(child.field) ||
                                      `child_${child.index}`
                                    }
                                    index={childIndex}
                                  >
                                    <FieldEditor
                                      field={child.field}
                                      index={child.index}
                                      register={register}
                                      control={control}
                                      setValue={setValue}
                                      onRemove={() => remove(child.index)}
                                      onDuplicate={() =>
                                        duplicateField(child.index)
                                      }
                                      advancedExpanded={getUiState(
                                        getStableId(child.field),
                                        'advanced'
                                      )}
                                      onToggleAdvanced={() =>
                                        toggleUiState(
                                          getStableId(child.field),
                                          'advanced'
                                        )
                                      }
                                      optionsExpanded={getUiState(
                                        getStableId(child.field),
                                        'options'
                                      )}
                                      onToggleOptions={() =>
                                        toggleUiState(
                                          getStableId(child.field),
                                          'options'
                                        )
                                      }
                                    />
                                  </SortableField>
                                ))}
                              </SortableSection>
                            ) : (
                              <SortableField id={group.id} index={index}>
                                <FieldEditor
                                  field={group.field}
                                  index={group.index}
                                  register={register}
                                  control={control}
                                  setValue={setValue}
                                  onRemove={() => remove(group.index)}
                                  onDuplicate={() =>
                                    duplicateField(group.index)
                                  }
                                  advancedExpanded={getUiState(
                                    group.id,
                                    'advanced'
                                  )}
                                  onToggleAdvanced={() =>
                                    toggleUiState(group.id, 'advanced')
                                  }
                                  optionsExpanded={getUiState(
                                    group.id,
                                    'options'
                                  )}
                                  onToggleOptions={() =>
                                    toggleUiState(group.id, 'options')
                                  }
                                />
                              </SortableField>
                            )}
                          </React.Fragment>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  <div className="mt-4 space-y-4">
                    <BottomDropZone
                      id="bottom-drop-zone"
                      isDragging={isDragging}
                      label="Soltar al final del formulario"
                    />
                    <AddFieldMenu
                      onAdd={addField}
                      className="dropdown-top w-full"
                      trigger={
                        <div className="btn btn-ghost btn-block h-24 border-2 border-dashed border-base-300 hover:border-primary hover:bg-base-100 text-base-content/50 hover:text-primary flex gap-2 normal-case transition-all">
                          <span className="text-3xl">+</span>
                          <span className="text-lg">Agregar Campo</span>
                        </div>
                      }
                    />
                  </div>
                </div>
              </DragDropContext>
            )}
          </>
        )}

        {activeTab === 'preview' && (
          <div className="lg:hidden">
            <LivePreview values={values} />
          </div>
        )}
      </div>

      {/* Right Column: Preview (Desktop Only) */}
      <div className="hidden lg:block lg:pl-8 lg:border-l border-base-200">
        <div className="sticky top-6">
          <h2 className="text-2xl font-bold mb-6">Vista Previa</h2>
          <LivePreview values={values} />
        </div>
      </div>
    </div>
  );
}

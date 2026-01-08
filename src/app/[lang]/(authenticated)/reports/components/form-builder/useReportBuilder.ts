import React from 'react';
import { Control, useFieldArray, UseFormSetValue } from 'react-hook-form';
import { DropResult } from '@hello-pangea/dnd';
import { ReportFormValues, GroupItem } from './types';
import { ReportFieldType } from '@/generated/prisma/client';
import { generateTempId } from './utils';

const SECTION_BREAK_VALUE = 'SECTION_BREAK';

interface UseReportBuilderProps {
  control: Control<ReportFormValues>;
  setValue: UseFormSetValue<ReportFormValues>;
}

export function useReportBuilder({ control }: UseReportBuilderProps) {
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

  const toggleUiState = React.useCallback(
    (id: string, key: 'section' | 'options' | 'advanced') => {
      setUiState((prev) => {
        const current = prev[id]?.[key];
        // Defaults:
        // Section: false (collapsed)
        // Options: false (collapsed)
        // Advanced: false (collapsed)
        const defaultValue = false;
        const newValue = current === undefined ? !defaultValue : !current;

        return {
          ...prev,
          [id]: {
            ...prev[id],
            [key]: newValue,
          },
        };
      });
    },
    []
  );

  const getUiState = React.useCallback(
    (id: string | undefined, key: 'section' | 'options' | 'advanced') => {
      if (!id) {
        return false;
      }
      const val = uiState[id]?.[key];
      if (val !== undefined) return val;
      return false;
    },
    [uiState]
  );

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

  // Group fields by section for rendering
  const groupedFields = React.useMemo(() => {
    const groups: GroupItem[] = [];

    let currentSection: GroupItem | null = null;

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
  }, [fields, getStableId]);

  const handleDragEnd = React.useCallback(
    (result: DropResult) => {
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
        const group = groupedFields.find(
          (g) => g.id === destination.droppableId
        );
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
    },
    [groupedFields, fields, replace]
  );

  const addField = React.useCallback(
    (type: ReportFieldType) => {
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
    },
    [fields, groupedFields, append, toggleUiState]
  );

  const addFieldToSection = React.useCallback(
    (sectionIndex: number, type: ReportFieldType) => {
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
    },
    [groupedFields, insert, toggleUiState]
  );

  const duplicateField = React.useCallback(
    (index: number) => {
      const field = fields[index];
      const newField = {
        ...field,
        id: generateTempId(),
        tempId: generateTempId(),
        key: `${field.key}_copy_${Date.now()}`,
        label: `${field.label} (Copia)`,
      };
      insert(index + 1, newField);
    },
    [fields, insert]
  );

  return {
    fields,
    groupedFields,
    handleDragEnd,
    addField,
    addFieldToSection,
    duplicateField,
    remove,
    getUiState,
    toggleUiState,
    getStableId,
    uiState,
  };
}

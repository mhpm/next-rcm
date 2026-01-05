'use client';

import React from 'react';
import {
  Control,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { ReportFormValues } from './types';
import { SortableField } from './SortableField';
import { AddFieldMenu } from './AddFieldMenu';
import { FieldsEmptyState } from './FieldsEmptyState';
import { GeneralSettingsForm } from './GeneralSettingsForm';
import { LivePreview } from './LivePreview';

import { SortableSection } from './SortableSection';
import { useReportBuilder } from './useReportBuilder';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

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
  const {
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
  } = useReportBuilder({ control, setValue });

  const [activeTab, setActiveTab] = React.useState<
    'settings' | 'fields' | 'preview'
  >('settings');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column: Form Builder */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Constructor de Formulario</h2>
          {activeTab === 'fields' && <AddFieldMenu onAdd={addField} />}
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as 'settings' | 'fields' | 'preview')
          }
        >
          <div className="w-full overflow-x-auto pb-2">
            <TabsList className="w-full min-w-max justify-start">
              <TabsTrigger value="settings">Configuración General</TabsTrigger>
              <TabsTrigger value="fields">Campos del Formulario</TabsTrigger>
              <TabsTrigger value="preview" className="lg:hidden">
                Vista Previa
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>

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
                onDragEnd={(result) => {
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
                                group={group}
                                register={register}
                                control={control}
                                setValue={setValue}
                                onRemove={remove}
                                onDuplicate={duplicateField}
                                onToggleUi={toggleUiState}
                                getUiState={getUiState}
                                getStableId={getStableId}
                                onAddFieldToSection={addFieldToSection}
                              />
                            ) : (
                              <SortableField
                                id={group.id}
                                index={index}
                                fieldIndex={group.index}
                                field={group.field}
                                register={register}
                                control={control}
                                setValue={setValue}
                                onRemove={remove}
                                onDuplicate={duplicateField}
                                advancedExpanded={getUiState(
                                  group.id,
                                  'advanced'
                                )}
                                optionsExpanded={getUiState(
                                  group.id,
                                  'options'
                                )}
                                onToggleUi={toggleUiState}
                              />
                            )}
                          </React.Fragment>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  <div className="mt-4 space-y-4">
                    <AddFieldMenu
                      onAdd={addField}
                      className="w-full"
                      trigger={
                        <Button
                          type="button"
                          variant="outline"
                          className="h-24 w-full border-2 border-dashed text-muted-foreground hover:text-primary"
                        >
                          <span className="text-3xl">+</span>
                          <span className="text-lg">Agregar Campo</span>
                        </Button>
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
            <LivePreview control={control} />
          </div>
        )}
      </div>

      {/* Right Column: Preview (Desktop Only) */}
      <div className="hidden lg:block lg:pl-8 lg:border-l border-border">
        <div className="sticky top-6">
          <h2 className="text-2xl font-bold mb-6">Vista Previa</h2>
          <LivePreview control={control} />
        </div>
      </div>
    </div>
  );
}

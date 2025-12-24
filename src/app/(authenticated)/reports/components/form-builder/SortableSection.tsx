import React from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import {
  RiDraggable,
  RiArrowDownSLine,
  RiArrowRightSLine,
} from 'react-icons/ri';

interface SortableSectionProps {
  id: string;
  index: number;
  children: React.ReactNode;
  header: React.ReactNode;
  footer?: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  isDropDisabled?: boolean;
}

export function SortableSection({
  id,
  index,
  children,
  header,
  footer,
  isExpanded,
  onToggle,
  isDropDisabled = false,
}: SortableSectionProps) {
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
              onClick={onToggle}
              className="mt-3 mr-2 text-muted-foreground hover:text-foreground transition-colors"
              onPointerDown={(e) => e.stopPropagation()}
            >
              {isExpanded ? (
                <RiArrowDownSLine size={20} />
              ) : (
                <RiArrowRightSLine size={20} />
              )}
            </button>

            <div className="flex-1">{header}</div>
          </div>

          {isExpanded && (
            <>
              <Droppable
                droppableId={id}
                type="ITEM"
                isDropDisabled={isDropDisabled}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-4 space-y-3 transition-colors ${
                      snapshot.isDraggingOver ? 'bg-primary/5' : 'bg-muted/20'
                    } ${footer ? '' : 'rounded-b-lg'}`}
                  >
                    {children}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              {footer && (
                <div className="p-4 bg-muted/20 border-t border-border rounded-b-lg">
                  {footer}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </Draggable>
  );
}

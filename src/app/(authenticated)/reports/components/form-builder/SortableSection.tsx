import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  RiDraggable,
  RiArrowDownSLine,
  RiArrowRightSLine,
} from 'react-icons/ri';

interface SortableSectionProps {
  id: string;
  children: React.ReactNode;
  header: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}

export function SortableSection({
  id,
  children,
  header,
  isExpanded,
  onToggle,
}: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    position: 'relative',
  };

  return (
    <div
      style={style}
      className={`border rounded-lg mb-4 bg-base-100 shadow-sm ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div
        ref={setNodeRef}
        className="flex items-start p-2 bg-base-200/50 rounded-t-lg border-b border-base-200"
      >
        <div
          className="mt-3 mr-2 cursor-grab active:cursor-grabbing text-base-content/40 hover:text-base-content"
          {...attributes}
          {...listeners}
        >
          <RiDraggable size={20} />
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="mt-3 mr-2 text-base-content/40 hover:text-base-content transition-colors"
          onPointerDown={(e) => e.stopPropagation()} // Prevent drag start on toggle
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
        <div className="p-4 bg-base-50/50 min-h-[60px] space-y-3 rounded-b-lg animate-in fade-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

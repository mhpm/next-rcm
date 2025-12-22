import React from "react";
import { Draggable } from "@hello-pangea/dnd";

export function SortableField({
  id,
  index,
  children,
  isDragDisabled = false,
}: {
  id: string;
  index: number;
  children: React.ReactNode;
  isDragDisabled?: boolean;
}) {
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
            marginBottom: "8px",
          }}
        >
          {children}
        </div>
      )}
    </Draggable>
  );
}

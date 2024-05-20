import React from "react";
import { useDroppable } from "@dnd-kit/core";

export function Droppable(props: {
  id: string;
  children:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | Iterable<React.ReactNode>
    | React.ReactPortal
    | null
    | undefined;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable-" + props.id,
  });
  const style = {
    color: isOver ? "green" : undefined,
    border: isOver ? "green" : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}

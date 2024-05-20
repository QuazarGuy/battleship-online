import React from 'react';
import {useDraggable} from '@dnd-kit/core';

export function Draggable(props: {
  element: string;
  id: string;
  children: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; 
}) {
  const Element = props.element || 'div';
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: props.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    background: `#00000000`,
    border: `transparent`,
  } : undefined;

  
  return (
    <button className="draggable" ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
}
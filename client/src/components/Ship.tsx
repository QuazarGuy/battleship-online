import { defaultAnnouncements, useDndMonitor } from "@dnd-kit/core";

export function Ship(props: {
  ship: string;
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
  useDndMonitor({
    onDragStart(event) {},
    onDragMove(event) {},
    onDragOver(event) {},
    onDragEnd(event) {},
    onDragCancel(event) {},
  });
  
  return <>{props.children}</>;
}

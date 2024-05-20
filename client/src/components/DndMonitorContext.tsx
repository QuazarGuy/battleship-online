import { useDndMonitor } from "@dnd-kit/core";

export function DndMonitorContext(event: any) {
  let monitor = null;
  // Monitor drag and drop events that happen on the parent `DndContext` provider
  useDndMonitor({
    onDragStart(event) {(event: string) => monitor = "start" + event;},
    onDragMove(event) {() => monitor = "moving";},
    onDragOver(event) {() => monitor = "over";},
    onDragEnd(event) {() => monitor = "end";},
    onDragCancel(event) {() => monitor = "cancel";},
  });

  return <><p>{monitor}</p></>;
}
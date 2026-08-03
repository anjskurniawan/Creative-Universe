import type { ComponentPropsWithoutRef } from "react";
import { TaskDiscussionPanel } from "@/components/odds/TaskCard";

type OddsTaskDiscussionPanelProps = Omit<ComponentPropsWithoutRef<"section">, "children"> & {
  taskId: string | number;
  userId?: number | null;
  taskStatus?: string | null;
};

/** Full Detail Task panel for the Discussion tab, including its surface container. */
export function OddsTaskDiscussionPanel({ taskId, userId, taskStatus, className = "", ...props }: OddsTaskDiscussionPanelProps) {
  return (
    <section {...props} className={className}>
      <TaskDiscussionPanel taskId={taskId} userId={userId} taskStatus={taskStatus} />
    </section>
  );
}

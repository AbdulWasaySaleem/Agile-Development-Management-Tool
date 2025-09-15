"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Clock, User } from "lucide-react";
import type { Task } from "./kanban-board";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

export function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isCurrentlyDragging = isDragging || isSortableDragging;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "cursor-grab active:cursor-grabbing transition-all hover:shadow-md",
        isCurrentlyDragging && "opacity-50 rotate-3 shadow-lg"
      )}
      {...attributes}
      {...listeners}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-medium leading-tight line-clamp-2">
            {task.title}
          </CardTitle>
          <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-3">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          {task.priority && (
            <Badge
              variant="secondary"
              className={cn(
                "text-xs",
                typeof task.priority === "string"
                  ? priorityColors[task.priority]
                  : ""
              )}
            >
              {typeof task.priority === "string" ? task.priority : "Unknown"}
            </Badge>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {task.assignedTo && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span className="truncate max-w-[60px]">{task.assignedTo}</span>
              </div>
            )}
            {task.createdAt && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{new Date(task.createdAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

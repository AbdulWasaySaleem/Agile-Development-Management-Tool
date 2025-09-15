"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Plus,
  CheckCircle,
  PlayCircle,
  List,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useProjectTasks, useUpdateTaskStatus } from "@/hooks/useTasks";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { AddTaskDialog } from "./add-task-dialog";
import { KanbanSkeleton } from "./kanban-skeleton";

dayjs.extend(relativeTime);

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "inProgress" | "done";
  priority?: "low" | "medium" | "high";
  updatedAt?: string;
}

const COLUMNS = [
  {
    id: "todo",
    title: "To Do",
    color: "bg-gray-50 dark:bg-slate-800/50",
    icon: List,
    borderColor: "border-gray-200 dark:border-slate-700",
    hoverColor: "hover:bg-gray-100 dark:hover:bg-slate-800",
  },
  {
    id: "inProgress",
    title: "In Progress",
    color: "bg-blue-50 dark:bg-blue-950/30",
    icon: PlayCircle,
    borderColor: "border-blue-200 dark:border-blue-800",
    hoverColor: "hover:bg-blue-100 dark:hover:bg-blue-950/50",
  },
  {
    id: "done",
    title: "Done",
    color: "bg-green-50 dark:bg-green-950/30",
    icon: CheckCircle,
    borderColor: "border-green-200 dark:border-green-800",
    hoverColor: "hover:bg-green-100 dark:hover:bg-green-950/50",
  },
] as const;

const PRIORITY_STYLES = {
  high: "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300",
  medium:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  low: "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/50 dark:text-green-300",
};

export function KanbanBoard() {
  const { id } = useParams();
  const { data: tasksData, isLoading } = useProjectTasks(id as string);
  const updateTaskMutation = useUpdateTaskStatus();

  const [tasks, setTasks] = useState<Record<string, Task[]>>({
    todo: [],
    inProgress: [],
    done: [],
  });
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [draggedOver, setDraggedOver] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!tasksData) return;

    const organized: Record<string, Task[]> = {
      todo: [],
      inProgress: [],
      done: [],
    };
    tasksData.forEach((task) => {
      const status = ["todo", "inProgress", "done"].includes(task.status)
        ? task.status
        : "todo";
      organized[status].push(task);
    });
    setTasks(organized);
  }, [tasksData]);

  const handleTaskAdded = (newTask: Task) => {
    setTasks((prev) => ({
      ...prev,
      [newTask.status]: [...(prev[newTask.status] || []), newTask],
    }));
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.style.transform = "rotate(5deg)";
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDraggedOver(columnId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDraggedOver(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedTask || draggedTask.status === targetColumnId) return;

    const sourceColumnId = draggedTask.status;

    setTasks((prev) => {
      const newTasks = { ...prev };
      if (!newTasks[sourceColumnId]) newTasks[sourceColumnId] = [];
      if (!newTasks[targetColumnId]) newTasks[targetColumnId] = [];

      newTasks[sourceColumnId] = newTasks[sourceColumnId].filter(
        (t) => t._id !== draggedTask._id
      );
      newTasks[targetColumnId] = [
        ...newTasks[targetColumnId],
        { ...draggedTask, status: targetColumnId },
      ];

      return newTasks;
    });

    updateTaskMutation.mutate({
      taskId: draggedTask._id,
      status: targetColumnId,
    });
    setDraggedTask(null);
    setDraggedOver(null);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.style.transform = "";
    setDraggedTask(null);
    setDraggedOver(null);
  };

  if (isLoading) {
    return <KanbanSkeleton />;
  }

  const totalTasks = Object.values(tasks).flat().length;
  const completedTasks = tasks.done?.length || 0;

  return (
    <div className="space-y-6 p-1">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Project Tasks
          </h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Visual task management</span>
            {totalTasks > 0 && (
              <span className="text-green-600 dark:text-green-400">
                {completedTasks}/{totalTasks} completed (
                {Math.round((completedTasks / totalTasks) * 100)}%)
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm font-medium px-3 py-1">
            {totalTasks} {totalTasks === 1 ? "task" : "tasks"}
          </Badge>
          <Button
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="font-medium shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      <AddTaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onTaskAdded={handleTaskAdded}
        projectId={id as string}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMNS.map((column) => {
          const Icon = column.icon;
          const columnTasks = tasks[column.id] || [];
          const isDropTarget = draggedOver === column.id;

          return (
            <div key={column.id} className="flex flex-col h-fit">
              {/* Column Header */}
              <div
                className={`p-4 rounded-t-xl border-2 ${column.borderColor} ${
                  column.color
                } transition-all duration-200 ${
                  isDropTarget
                    ? "ring-2 ring-blue-400 ring-offset-2 scale-[1.02]"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-800/80 shadow-sm">
                      <Icon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {column.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {columnTasks.length}{" "}
                        {columnTasks.length === 1 ? "item" : "items"}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-xs font-medium bg-white/80 dark:bg-slate-800/80"
                  >
                    {columnTasks.length}
                  </Badge>
                </div>
              </div>

              {/* Scrollable Task Container */}
              <div
                className={`
                  flex-1 p-4 border-2 border-t-0 rounded-b-xl transition-all duration-200
                  ${column.borderColor} ${column.color}
                  ${
                    isDropTarget
                      ? "ring-2 ring-blue-400 ring-offset-2 scale-[1.02] bg-blue-50 dark:bg-blue-950/50"
                      : ""
                  }
                `}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div
                  className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent pr-2"
                  style={{
                    scrollbarWidth: "thin",
                  }}
                >
                  {columnTasks.map((task, index) => (
                    <div
                      key={task._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      onDragEnd={handleDragEnd}
                      className={`
                        group p-4 bg-white dark:bg-slate-900 rounded-lg shadow-sm 
                        cursor-move transition-all duration-200 border border-gray-200 dark:border-slate-700
                        ${
                          draggedTask?._id === task._id
                            ? "opacity-60 scale-105 shadow-lg rotate-2 border-blue-300 dark:border-blue-600"
                            : "hover:shadow-md hover:border-gray-300 dark:hover:border-slate-600 hover:-translate-y-1"
                        }
                      `}
                    >
                      {/* Task Header */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white line-clamp-2 leading-snug">
                          {task.title}
                        </h4>
                        {task.priority && (
                          <Badge
                            variant="outline"
                            className={`text-xs font-medium shrink-0 ${
                              PRIORITY_STYLES[task.priority]
                            }`}
                          >
                            {task.priority === "high" && (
                              <AlertCircle className="w-3 h-3 mr-1" />
                            )}
                            {task.priority.charAt(0).toUpperCase() +
                              task.priority.slice(1)}
                          </Badge>
                        )}
                      </div>

                      {/* Task Description */}
                      {task.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {/* Task Footer */}
                      {task.updatedAt && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-slate-800">
                          <Clock className="w-3 h-3" />
                          <span>Updated {dayjs(task.updatedAt).fromNow()}</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Empty State */}
                  {columnTasks.length === 0 && (
                    <div
                      className={`
                      flex flex-col items-center justify-center h-32 
                      text-gray-400 dark:text-gray-500 text-sm 
                      border-2 border-dashed border-gray-200 dark:border-gray-700 
                      rounded-lg transition-all duration-200
                      ${
                        isDropTarget
                          ? "border-blue-400 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                          : "hover:border-gray-300 dark:hover:border-gray-600"
                      }
                    `}
                    >
                      {isDropTarget ? (
                        <>
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2">
                            <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="font-medium">Drop task here</span>
                        </>
                      ) : (
                        <>
                          <Icon className="w-8 h-8 mb-2 opacity-30" />
                          <span>No tasks yet</span>
                          <span className="text-xs opacity-75">
                            Drag tasks here or add new ones
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Indicator */}
      {totalTasks > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Overall Progress
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {completedTasks} of {totalTasks} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

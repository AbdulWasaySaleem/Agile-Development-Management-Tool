"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ClipboardList, Clock4, Gauge, CheckCircle2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

type TaskCounts = {
  todo: number;
  inProgress: number;
  done: number;
  total: number;
};

interface KPISectionProps {
  taskCounts: TaskCounts;
  loading: boolean;
}

const kpis = [
  {
    key: "total",
    label: "Total Tasks",
    icon: ClipboardList,
    color: "from-slate-500 to-slate-600",
  },
  {
    key: "todo",
    label: "To Do",
    icon: Clock4,
    color: "from-amber-500 to-orange-600",
  },
  {
    key: "inProgress",
    label: "In Progress",
    icon: Gauge,
    color: "from-blue-500 to-indigo-600",
  },
  {
    key: "done",
    label: "Completed",
    icon: CheckCircle2,
    color: "from-emerald-500 to-green-600",
  },
];

export default function KPISection({ taskCounts, loading }: KPISectionProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-10 w-10 rounded-xl" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-16 rounded mb-2" />
              <Skeleton className="h-2 w-full rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const completionRate =
    taskCounts.total > 0 ? (taskCounts.done / taskCounts.total) * 100 : 0;

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map(({ key, label, icon: Icon, color }) => {
        const value = taskCounts[key as keyof TaskCounts];
        const percentage =
          taskCounts.total > 0 && key !== "total"
            ? (value / taskCounts.total) * 100
            : 0;

        return (
          <Card
            key={key}
            className={cn(
              "hover:shadow-lg transition-all duration-300",
              "border-0 shadow-md bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
            )}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {label}
                </CardTitle>
                <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                  <Icon className={cn("h-5 w-5", color)} />
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-end justify-between mb-3">
                <div
                  className={cn(
                    "text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent",
                    color
                  )}
                >
                  {value}
                </div>
                {key !== "total" && taskCounts.total > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {percentage.toFixed(0)}%
                  </span>
                )}
              </div>

              {key !== "total" && taskCounts.total > 0 && (
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full bg-gradient-to-r", color)}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              )}

              {key === "total" && (
                <>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{completionRate.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-green-600"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

"use client";
import React, { useState } from "react";
import dayjs from "dayjs";
import { ChevronDown, ChevronRight } from "lucide-react";

interface Task {
  _id: string;
  title: string;
  description: string;
  assignedBy: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  status: "done" | "in-progress" | "pending" | "cancelled";
  methodology: string;
  currentPhase?: string;
}

interface GanttChartProps {
  tasks: Task[];
}

export default function GanttChart({ tasks = [] }: GanttChartProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const statusClasses = {
    done: "bg-green-600/20 text-green-400",
    "in-progress": "bg-yellow-600/20 text-yellow-400",
    todo: "bg-gray-50 dark:bg-slate-800/50",
    inProgress:"bg-blue-50 dark:bg-blue-950/30",
  };

  return (
    <div className="overflow-x-auto rounded-2xl shadow-md border border-border bg-card text-card-foreground">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-secondary text-secondary-foreground">
          <tr>
            <th className="px-4 py-2 w-10"></th>
            <th className="px-4 py-2">Task</th>
            <th className="px-4 py-2">Start</th>
            <th className="px-4 py-2">Updated</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const isOpen = expanded === task._id;
            return (
              <React.Fragment key={task._id}>
                <tr
                  className="border-b border-border hover:bg-muted/50 transition cursor-pointer"
                  onClick={() => toggleRow(task._id)}
                >
                  <td className="px-4 py-2">
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </td>
                  <td className="px-4 py-2 font-medium">{task.title}</td>
                  <td className="px-4 py-2">
                    {dayjs(task.createdAt).format("MMM D, YYYY h:mm A")}
                  </td>
                  <td className="px-4 py-2">
                    {dayjs(task.updatedAt).fromNow()}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        statusClasses[task.status]
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                </tr>

                {isOpen && (
                  <tr className="bg-muted/30">
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-sm text-muted-foreground"
                    >
                      <p className="mb-2">
                        <span className="font-semibold">Description:</span>{" "}
                        {task.description || "No description provided"}
                      </p>
                      <p className="mb-1">
                        <span className="font-semibold">Methodology:</span>{" "}
                        {task.methodology}
                      </p>
                      {task.currentPhase && (
                        <p>
                          <span className="font-semibold">Current Phase:</span>{" "}
                          {task.currentPhase}
                        </p>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

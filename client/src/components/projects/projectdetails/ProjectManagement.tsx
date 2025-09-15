"use client";

import { useState, useMemo } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  CheckCircle2,
  Users,
  Target,
  Activity,
  Calendar,
  Clock,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

import GantChart from "../projectMethodology/GanttChart";
import Dashboard from "../projectMethodology/Dashboard";
import { useProjectTasks } from "@/hooks/useTasks";
import { Project } from "@/types/project";
import { KanbanBoard } from "../projectMethodology/kanban/kanban-board";
import { XPBoard } from "../projectMethodology/xp/xp-board";
import { ScrumBoard } from "../projectMethodology/scrum/scrum-board";

// Initialize dayjs plugins
dayjs.extend(relativeTime);

interface Props {
  project: Project;
}

const VIEW_OPTIONS = [
  { view: "Dashboard" as const, label: "Overview", icon: BarChart3 },
  { view: "Task" as const, label: "Tasks", icon: CheckCircle2 },
  { view: "Board" as const, label: "Board", icon: Target },
  { view: "Gantt" as const, label: "Timeline", icon: Calendar },
] as const;

type ViewType = (typeof VIEW_OPTIONS)[number]["view"];

export default function ProjectManagement({ project }: Props) {
  const [selectedView, setSelectedView] = useState<ViewType>("Dashboard");

  const { data: tasks = [], isLoading, error } = useProjectTasks(project._id);

  // Memoized calculations for better performance
  const projectStats = useMemo(() => {
    const taskCounts = {
      total: tasks.length,
      todo: tasks.filter(
        (t) => t.status?.toLowerCase().replace(/\s/g, "") === "todo"
      ).length,
      inProgress: tasks.filter(
        (t) => t.status?.toLowerCase().replace(/\s/g, "") === "inprogress"
      ).length,
      done: tasks.filter(
        (t) => t.status?.toLowerCase().replace(/\s/g, "") === "done"
      ).length,
    };

    const completionRate =
      taskCounts.total > 0
        ? Math.round((taskCounts.done / taskCounts.total) * 100)
        : 0;

    // Time-based progress calculation
    const timeProgress = (() => {
      if (!project.startDate || !project.endDate) return 0;
      const start = dayjs(project.startDate);
      const end = dayjs(project.endDate);
      const now = dayjs();

      if (now.isBefore(start)) return 0;
      if (now.isAfter(end)) return 100;

      return Math.round((now.diff(start) / end.diff(start)) * 100);
    })();

    const daysRemaining = project.endDate
      ? Math.max(0, dayjs(project.endDate).diff(dayjs(), "day"))
      : null;

    return {
      taskCounts,
      completionRate,
      timeProgress,
      daysRemaining,
    };
  }, [tasks, project.startDate, project.endDate]);

  const getProjectStatusColor = () => {
    const { completionRate, timeProgress, daysRemaining } = projectStats;

    if (completionRate >= 90)
      return "text-green-600 bg-green-50 border-green-200";
    if (daysRemaining !== null && daysRemaining <= 3)
      return "text-red-600 bg-red-50 border-red-200";
    if (timeProgress > completionRate + 20)
      return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-blue-600 bg-blue-50 border-blue-200";
  };

  const renderViewContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
          <AlertCircle className="w-12 h-12 mb-3 text-red-400" />
          <p>Error loading project data</p>
        </div>
      );
    }

    switch (selectedView) {
      case "Dashboard":
        return <Dashboard projects={project} />;

      case "Task":
        return (
          <div className="space-y-4">
            {projectStats.taskCounts.total === 0 ? (
              <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
                <p className="text-sm">Create your first task to get started</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {tasks.map((task, idx) => (
                  <div
                    key={task._id}
                    className="group p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl hover:shadow-md hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                            {task.title}
                          </h4>
                          <Badge
                            variant="secondary"
                            className="text-xs font-medium shrink-0"
                          >
                            #{idx + 1}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {task.description || "No description provided"}
                        </p>
                        {task.dueDate && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>Due {dayjs(task.dueDate).fromNow()}</span>
                          </div>
                        )}
                      </div>
                      <Badge
                        className={`ml-3 shrink-0 ${
                          task.status?.toLowerCase() === "done"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : task.status?.toLowerCase() === "inprogress"
                            ? "bg-blue-100 text-blue-700 border-blue-200"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                      >
                        {task.status || "Todo"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "Board":
        return (
          <div className="min-h-[500px]">
            {project.methodology === "Scrum" ? (
              <ScrumBoard />
            ) : project.methodology === "Kanban" ? (
              <KanbanBoard />
            ) : project.methodology === "XP" ? (
              <XPBoard />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
                <BarChart3 className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Board Not Available
                </h3>
                <p className="text-sm">
                  No board configured for {project.methodology} methodology
                </p>
              </div>
            )}
          </div>
        );

      case "Gantt":
        return (
          <div className="p-2">
            <GantChart tasks={tasks} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {project.name || "Project Management"}
            </h1>
          </div>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Badge variant="outline" className={getProjectStatusColor()}>
                {project.methodology}
              </Badge>
            </div>
            {project.endDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Due {dayjs(project.endDate).format("MMM D, YYYY")}</span>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Navigation */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl px-1.5 py-1 shadow-md border border-gray-200 dark:border-gray-700 overflow-x-auto">
            <div className="flex gap-1 sm:gap-2">
              {VIEW_OPTIONS.map(({ view, label, icon: Icon }) => (
                <Button
                  key={view}
                  onClick={() => setSelectedView(view)}
                  variant="ghost"
                  className={`flex items-center px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                    selectedView === view
                      ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {/* Project Status */}
          <Card className="group hover:shadow-lg transition-all duration-200 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Project Status
                </CardTitle>
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                  <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {project.status || "Active"}
                </p>
                {projectStats.daysRemaining !== null && (
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {projectStats.daysRemaining} days left
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Tasks Card */}
          <Card className="group hover:shadow-lg transition-all duration-200 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Tasks
                </CardTitle>
                <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {projectStats.taskCounts.total}
                  </p>
                  <div className="flex gap-3 text-xs">
                    <span className="text-gray-500">
                      {projectStats.taskCounts.todo} Todo
                    </span>
                    <span className="text-blue-500">
                      {projectStats.taskCounts.inProgress} In Progress
                    </span>
                    <span className="text-green-500">
                      {projectStats.taskCounts.done} Done
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card className="group hover:shadow-lg transition-all duration-200 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Team Size
                </CardTitle>
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors">
                  <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {project.members?.length || 0}
                </p>
                <div className="text-right">
                  <p className="text-xs text-gray-500">members</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Progress Card */}
          <Card className="group hover:shadow-lg transition-all duration-200 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Completion
                </CardTitle>
                <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors">
                  <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {projectStats.completionRate}%
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {projectStats.taskCounts.done}/
                    {projectStats.taskCounts.total}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Progress
                    value={projectStats.completionRate}
                    className="h-2 bg-gray-200 dark:bg-gray-700"
                  />
                  {projectStats.timeProgress !==
                    projectStats.completionRate && (
                    <div className="text-xs text-gray-500">
                      Time: {projectStats.timeProgress}% elapsed
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Content Area */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {(() => {
                    const currentView = VIEW_OPTIONS.find(
                      (v) => v.view === selectedView
                    );
                    const Icon = currentView?.icon || BarChart3;
                    return (
                      <>
                        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {currentView?.label || selectedView}
                        </h2>
                      </>
                    );
                  })()}
                </div>
                {project.endDate && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {dayjs(project.endDate).isBefore(dayjs()) ? (
                      <span className="text-red-500 font-medium">Overdue</span>
                    ) : (
                      <span>Ends {dayjs(project.endDate).fromNow()}</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">{renderViewContent()}</div>
          </CardContent>
        </Card>

        {/* Project Timeline Footer */}
        {(project.startDate || project.endDate) && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-4 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              {project.startDate && (
                <div className="text-sm">
                  <span className="text-gray-500">Started:</span>
                  <span className="ml-1 font-medium text-gray-900 dark:text-white">
                    {dayjs(project.startDate).format("MMM D, YYYY")}
                  </span>
                </div>
              )}
              {project.startDate && project.endDate && (
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
              )}
              {project.endDate && (
                <div className="text-sm">
                  <span className="text-gray-500">Due:</span>
                  <span className="ml-1 font-medium text-gray-900 dark:text-white">
                    {dayjs(project.endDate).format("MMM D, YYYY")}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

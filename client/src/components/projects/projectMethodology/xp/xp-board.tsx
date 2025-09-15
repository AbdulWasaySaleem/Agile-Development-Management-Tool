"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, ChevronDown } from "lucide-react";
import { XPPhaseCard } from "./xp-phase-card";
import { AddTaskDialog } from "../kanban/add-task-dialog";
import { AddXPPhaseDialog } from "./add-xp-phase-dialo";
import { useGetAllTaskXpPhases, useProjectTasks } from "@/hooks/useTasks";
import { useParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-hot-toast"; // using sonner toast
import axiosInstance from "@/app/lib/axiosInstance";

const phases = ["Planning", "Design", "Coding", "Testing", "Release"];

export function XPBoard() {
  const params = useParams();
  const projectId = params?.id as string;
  const [selectedPhase, setSelectedPhase] = useState(phases[0]);

  const { data: projectTasks, isLoading: tasksLoading } =
    useProjectTasks(projectId);
  const {
    data: xpPhases,
    isLoading: xpPhasesLoading,
    refetch,
  } = useGetAllTaskXpPhases(projectId);

  const tasks = projectTasks || [];
  const xpPhaseList = xpPhases || [];

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);

  const availableTasks = tasks.filter(
    (task: any) => task.status?.toLowerCase() === "todo"
  );

  // 🔹 API Handlers
  const updatePhase = async (xpPhaseId: string, newPhase: string) => {
    try {
      console.log(xpPhaseId, newPhase);
      const response = await axiosInstance.patch(
        `/api/v1/xproute/update-phase/${xpPhaseId}`,
        { currentPhase: newPhase }
      );
      toast.success(response.data.message || "XP Phase updated");
      refetch();
    } catch (error) {
      toast.error("Failed to update XP Phase");
    }
  };

  const updateCodingFields = async (xpPhaseId: string, updates: any) => {
    try {
      console.log(xpPhaseId, updates);
      const response = await axiosInstance.patch(
        `/api/v1/xproute/update-code-fields/${xpPhaseId}`,
        updates
      );
      toast.success(response.data.message || "Coding fields updated");
      refetch();
    } catch (error) {
      toast.error("Failed to update coding fields");
    }
  };

  const updateTestingFields = async (xpPhaseId: string, updates: any) => {
    try {
      console.log(xpPhaseId, updates);
      const response = await axiosInstance.patch(
        `/api/v1/xproute/update-test-fileds/${xpPhaseId}`,
        updates
      );
      toast.success(response.data.message || "Testing fields updated");
      refetch();
    } catch (error) {
      toast.error("Failed to update testing fields");
    }
  };

  const updateReleaseFields = async (xpPhaseId: string, updates: any) => {
    try {
      console.log(xpPhaseId, updates);
      const response = await axiosInstance.patch(
        `/api/v1/xproute/update-release-fileds/${xpPhaseId}`,
        updates
      );
      toast.success(response.data.message || "Release fields updated");
      refetch();
    } catch (error) {
      toast.error("Failed to update release fields");
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">XP Board</h1>
        <Button
          size="sm"
          onClick={() => setIsTaskDialogOpen(true)}
          className="font-medium shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Available Tasks with Dropdown */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <CardTitle className="flex items-center gap-2">
            Available Tasks
            <Badge variant="secondary">{availableTasks.length}</Badge>
          </CardTitle>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center w-full sm:w-auto">
                Select Task
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Available Tasks</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {availableTasks.length === 0 ? (
                <DropdownMenuItem disabled>No tasks available</DropdownMenuItem>
              ) : (
                availableTasks.map((task: any) => (
                  <DropdownMenuItem
                    key={task._id}
                    className="flex justify-between items-center gap-2"
                  >
                    <span className="truncate max-w-[120px]">{task.title}</span>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setSelectedTaskId(task._id);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Select a task from the dropdown to add it to an XP phase.
          </p>
        </CardContent>
      </Card>

      {/* XP Phases Tabs */}
      <Tabs value={selectedPhase} onValueChange={setSelectedPhase}>
        <TabsList className="flex w-full overflow-x-auto scrollbar-hide">
  {phases.map((phase) => (
    <TabsTrigger
      key={phase}
      value={phase}
      className="text-xs sm:text-sm whitespace-nowrap px-3"
    >
      {phase}
    </TabsTrigger>
  ))}
</TabsList>


        {phases.map((phase) => {
          const phaseTasks = xpPhaseList.filter(
            (xp: any) => xp.currentPhase === phase
          );
          return (
            <TabsContent key={phase} value={phase} className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <h2 className="text-xl font-semibold">{phase} Phase</h2>
                <Badge variant="outline">{phaseTasks.length} tasks</Badge>
              </div>

              {xpPhasesLoading ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">Loading phases...</p>
                  </CardContent>
                </Card>
              ) : phaseTasks.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">
                      No tasks in {phase} phase
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {phaseTasks.map((xpPhase: any) => (
                    <XPPhaseCard
                      key={xpPhase._id}
                      xpPhase={xpPhase}
                      currentPhase={phase}
                      onUpdatePhase={updatePhase}
                      onUpdateCoding={updateCodingFields}
                      onUpdateTesting={updateTestingFields}
                      onUpdateRelease={updateReleaseFields}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Dialogs */}
      <AddXPPhaseDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedTaskId(null);
        }}
        onSuccess={() => {
          setIsDialogOpen(false);
          setSelectedTaskId(null);
          refetch();
        }}
        taskId={selectedTaskId}
        projectId={projectId}
      />

      <AddTaskDialog
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        projectId={projectId}
      />
    </div>
  );
}

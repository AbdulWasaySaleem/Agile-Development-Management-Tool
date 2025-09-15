"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAssignSprint, useProjectTasks } from "@/hooks/useTasks";
import { useFetchSprints } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { useParams } from "next/navigation";
import {
  AssignSprintFormData,
  assignSprintSchema,
} from "@/validations/sprintValidation";

type Props = {
  projectId: string;
};

export function AssignSprintModal({ projectId }: Props) {
  const [open, setOpen] = useState(false);
  const assignSprint = useAssignSprint();
  // fetch sprints for this project only
  const { data: sprintsData } = useFetchSprints(projectId);

  // fetch tasks (filtering will come next step)
  const { data: tasksData } = useProjectTasks(projectId);

  console.log("assign-task-dialog", tasksData);
  const unassignedTasks = tasksData?.filter((task: any) => !task.sprint);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<AssignSprintFormData>({
    resolver: zodResolver(assignSprintSchema),
    defaultValues: { sprintId: "", taskIds: [] },
  });

  const onSubmit = (data: AssignSprintFormData) => {
    assignSprint.mutate(data, {
      onSuccess: (res) => {
        toast.success(res.message || "Tasks assigned successfully");
        reset();
        setOpen(false);
      },
    });
  };

  const selectedTasks = watch("taskIds");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Assign Tasks</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Tasks to Sprint</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Sprint Dropdown */}
          <div>
            <label className="text-sm font-medium">Sprint</label>
            <Select
              onValueChange={(value) => setValue("sprintId", value)}
              defaultValue=""
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sprint" />
              </SelectTrigger>
              <SelectContent>
                {sprintsData?.data?.map((sprint: any) => (
                  <SelectItem key={sprint._id} value={sprint._id}>
                    {sprint.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.sprintId && (
              <p className="text-xs text-red-500">{errors.sprintId.message}</p>
            )}
          </div>

          {/* Task Multiselect */}
          <div>
            <label className="text-sm font-medium">Tasks</label>
            <div className="max-h-48 overflow-y-auto border rounded p-2 space-y-1">
              {unassignedTasks?.length ? (
                unassignedTasks.map((task: any) => {
                  const checked = selectedTasks.includes(task._id);
                  return (
                    <label
                      key={task._id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={task._id}
                        checked={checked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setValue("taskIds", [...selectedTasks, task._id]);
                          } else {
                            setValue(
                              "taskIds",
                              selectedTasks.filter(
                                (id: string) => id !== task._id
                              )
                            );
                          }
                        }}
                      />
                      <span>{task.title}</span>
                    </label>
                  );
                })
              ) : (
                <p className="text-xs text-muted-foreground">
                  No unassigned tasks available
                </p>
              )}
            </div>
            {errors.taskIds && (
              <p className="text-xs text-red-500">{errors.taskIds.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || assignSprint.isPending}
          >
            {assignSprint.isPending ? "Assigning..." : "Assign"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

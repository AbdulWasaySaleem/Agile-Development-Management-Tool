"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import axiosInstance from "@/app/lib/axiosInstance";
import { useAddXPPhase } from "@/hooks/useProjects";
import { useUpdateTaskStatus } from "@/hooks/useTasks";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AddTaskDialog } from "../kanban/add-task-dialog";

interface AddXPPhaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  taskId: string | null;
  projectId: string;
}

const phases = ["Planning", "Design", "Coding", "Testing", "Release"];
const priorities = ["High", "Medium", "Low"];

interface FormData {
  currentPhase: string;
  priority: string;
  description: string;
  designNotes: string;
}

export function AddXPPhaseDialog({
  isOpen,
  onClose,
  onSuccess,
  taskId,
  projectId,
}: AddXPPhaseDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  // initialize mutation hook
  const addXPPhase = useAddXPPhase(() => {
    reset();
    onClose(); // close dialog on success
  });
  const updateTaskStatus = useUpdateTaskStatus();

  const onSubmit = (data: FormData) => {
    if (!taskId) return toast.error("No task selected");

    // build payload
    const payload = {
      projectId,
      taskId,
      currentPhase: data.currentPhase,
      priority: data.priority,
      description: data.description,
      designNotes: data.designNotes,
    };

    console.log("Submitting payload:", payload);

    addXPPhase.mutate(payload, {
      onSuccess: () => {
        updateTaskStatus.mutate({ taskId, status: "inProgress" });
      },
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
       
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add XP Phase</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPhase">Current Phase *</Label>
              <Select
                onValueChange={(value) => setValue("currentPhase", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a phase" />
                </SelectTrigger>
                <SelectContent>
                  {phases.map((phase) => (
                    <SelectItem key={phase} value={phase}>
                      {phase}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.currentPhase && (
                <p className="text-sm text-destructive">
                  Please select a phase
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select onValueChange={(value) => setValue("priority", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-sm text-destructive">
                  Please select a priority
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Enter task description"
                {...register("description", {
                  required: "Description is required",
                })}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="designNotes">Design Notes</Label>
              <Textarea
                id="designNotes"
                placeholder="Enter design notes (optional)"
                {...register("designNotes")}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Phase"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    
    </>
  );
}

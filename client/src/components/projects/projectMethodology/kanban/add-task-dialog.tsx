"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { AlertCircle, CheckCircle, Clock, List, PlayCircle } from "lucide-react";
import type { Task } from "./kanban-board";
import { useAuthStore } from "@/app/store/authStore";
import { useAddTask } from "@/hooks/useTasks";

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskAdded: (task: Task) => void;
  projectId: string;
}

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low Priority", color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-950/30" },
  { value: "medium", label: "Medium Priority", color: "text-amber-600", bgColor: "bg-amber-50 dark:bg-amber-950/30" },
  { value: "high", label: "High Priority", color: "text-red-600", bgColor: "bg-red-50 dark:bg-red-950/30" },
];

const STATUS_OPTIONS = [
  { value: "todo", label: "To Do", icon: List, color: "text-gray-600" },
  { value: "inProgress", label: "In Progress", icon: PlayCircle, color: "text-blue-600" },
  { value: "done", label: "Done", icon: CheckCircle, color: "text-green-600" },
];

export function AddTaskDialog({ open, onOpenChange, onTaskAdded, projectId }: AddTaskDialogProps) {
  const { user } = useAuthStore();
  const addTaskMutation = useAddTask(projectId);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as Task["priority"],
    status: "todo" as Task["status"],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    addTaskMutation.mutate(
      { 
        ...formData, 
        title: formData.title.trim(),
        description: formData.description.trim(),
        assignedBy: user.id 
      },
      {
        onSuccess: (newTask) => {
          // Reset form
          setFormData({ 
            title: "", 
            description: "", 
            priority: "medium", 
            status: "todo" 
          });
          setErrors({});
          onTaskAdded(newTask);
          onOpenChange(false);
          toast.success("Task added successfully! 🎉");
        },
        onSettled: () => {
          setLoading(false);
        },
      }
    );
  };

  const handleCancel = () => {
    setFormData({ 
      title: "", 
      description: "", 
      priority: "medium", 
      status: "todo" 
    });
    setErrors({});
    onOpenChange(false);
  };

  const selectedPriority = PRIORITY_OPTIONS.find(p => p.value === formData.priority);
  const selectedStatus = STATUS_OPTIONS.find(s => s.value === formData.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Create New Task
          </DialogTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Add a new task to your project and start tracking progress
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Task Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g., Design user interface mockups"
              className={`transition-colors ${errors.title 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                : 'focus:border-blue-500 focus:ring-blue-200'
              }`}
              maxLength={100}
            />
            {errors.title && (
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4" />
                {errors.title}
              </div>
            )}
            <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
              {formData.title.length}/100
            </div>
          </div>

          {/* Task Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Provide more details about this task..."
              rows={4}
              className={`resize-none transition-colors ${errors.description 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                : 'focus:border-blue-500 focus:ring-blue-200'
              }`}
              maxLength={500}
            />
            {errors.description && (
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4" />
                {errors.description}
              </div>
            )}
            <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
              {formData.description.length}/500
            </div>
          </div>

          {/* Priority and Status Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority Selection */}
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Priority Level
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value: Task["priority"]) =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger className="focus:border-blue-500 focus:ring-blue-200">
                  <SelectValue>
                    {selectedPriority && (
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          selectedPriority.value === 'high' ? 'bg-red-500' :
                          selectedPriority.value === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                        }`} />
                        <span>{selectedPriority.label}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          priority.value === 'high' ? 'bg-red-500' :
                          priority.value === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                        }`} />
                        <span>{priority.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Selection */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Initial Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: Task["status"]) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="focus:border-blue-500 focus:ring-blue-200">
                  <SelectValue>
                    {selectedStatus && (
                      <div className="flex items-center gap-2">
                        <selectedStatus.icon className={`w-4 h-4 ${selectedStatus.color}`} />
                        <span>{selectedStatus.label}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      <div className="flex items-center gap-2">
                        <status.icon className={`w-4 h-4 ${status.color}`} />
                        <span>{status.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Task Preview */}
          {formData.title.trim() && (
            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Task Preview
              </h4>
              <div className="bg-white dark:bg-slate-900 p-3 rounded-md border border-gray-200 dark:border-slate-700">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    {formData.title}
                  </span>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    formData.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300' :
                    formData.priority === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' :
                    'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300'
                  }`}>
                    {formData.priority?.charAt(0).toUpperCase() + formData.priority?.slice(1)}
                  </div>
                </div>
                {formData.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                    {formData.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>Just now</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-slate-700">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={loading}
              className="px-6"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.title.trim()}
              className="px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </div>
              ) : (
                "Create Task"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
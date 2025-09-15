"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Task } from "@/types/task";
import {
  addTask,
  assignSprintApi,
  deleteTask,
  fetchTaskForSprints,
  getAllProjectTasks,
  getAllTasks,
  getAllXPTaskPhases,
  updateTaskStatus,
} from "@/api/tasksApi";
import toast from "react-hot-toast";
import { TaskFormData } from "@/validations/taskvalidation";

interface TaskCounts {
  todo: number;
  inProgress: number;
  done: number;
  total: number;
}

export interface TasksByStatus {
  todo: Task[];
  inProgress: Task[];
  done: Task[];
}

function calculateTaskCounts(tasks: Task[]): TaskCounts {
  const counts: TaskCounts = {
    todo: 0,
    inProgress: 0,
    done: 0,
    total: tasks.length,
  };

  tasks.forEach((task) => {
    const status = (task.status || "").toLowerCase().replace(/\s/g, "");
    if (status === "todo") counts.todo += 1;
    if (status === "inprogress") counts.inProgress += 1;
    if (status === "done") counts.done += 1;
  });

  return counts;
}

export function useTasks() {
  const query = useQuery<Task[], Error>({
    queryKey: ["tasks"],
    queryFn: getAllTasks,
    staleTime: 1000 * 60, // 1 min cache
  });

  const taskCounts = query.data
    ? calculateTaskCounts(query.data)
    : {
        todo: 0,
        inProgress: 0,
        done: 0,
        total: 0,
      };

  return {
    tasks: query.data ?? [],
    taskCounts,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useProjectTasks(projectId: string) {
  return useQuery<Task[], Error>({
    queryKey: ["projectTasks", projectId], // include projectId in the key
    queryFn: () => getAllProjectTasks(projectId), // pass projectId to the function
    staleTime: 1000 * 60, // 1 min cache
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      status,
    }: {
      taskId: string;
      status: Task["status"];
    }) => updateTaskStatus(taskId, status),
    // Optimistic UI update
    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey: ["projectTasks"] });

      const previousTasks = queryClient.getQueryData<Task[]>(["projectTasks"]);

      queryClient.setQueryData<Task[]>(["projectTasks"], (old) =>
        old?.map((task) => (task._id === taskId ? { ...task, status } : task))
      );

      return { previousTasks };
    },
    onSuccess: (data) => {
      toast.success(data.message || "Task status updated successfully");
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["projectTasks"], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(["projectTasks"]);
    },
  });
}

export function useAddTask(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskData: Omit<TaskFormData, "assignedTo">) =>
      addTask({ ...taskData, assignedTo: projectId }),
    onSuccess: (newTask) => {
      queryClient.setQueryData<Task[]>(
        ["projectTasks", projectId],
        (old = []) => [...old, newTask]
      );
      toast.success(newTask.message || "Task added successfully");
    },
  });
}

export const useSprintTasks = (sprintId: string) => {
  return useQuery<TasksByStatus>({
    queryKey: ["sprintTasks", sprintId],
    queryFn: () => fetchTaskForSprints(sprintId),
    enabled: !!sprintId,
    staleTime: 1000 * 60, // cache 1 min
  });
};

export function useAssignSprint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sprintId,
      taskIds,
    }: {
      sprintId: string;
      taskIds: string[];
    }) => assignSprintApi(sprintId, taskIds),
    onSuccess: (_, { sprintId }) => {
      // Refresh tasks for that sprint
      queryClient.invalidateQueries({ queryKey: ["sprintTasks", sprintId] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // optional global invalidation
    },
  });
}

export function useGetAllTaskXpPhases(projectId: string) {
  return useQuery({
    queryKey: ["xp-task-phases", projectId],
    queryFn: () => getAllXPTaskPhases(projectId),
    enabled: !!projectId, // only fetch if projectId exists
    staleTime: 1000 * 60 * 5, // cache for 5 min
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (_, taskId) => {
      // Optimistic update: remove the task locally
      queryClient.setQueryData(["projects"], (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.map((project: any) => ({
          ...project,
          tasks: project.tasks.filter((t: any) => t._id !== taskId),
        }));
      });
      toast.success("Task deleted successfully");
    },
  });
}

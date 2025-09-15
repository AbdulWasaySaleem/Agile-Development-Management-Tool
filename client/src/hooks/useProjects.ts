"use client";

import { Project } from "@/types/project";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addNewProject,
  addProjectMember,
  deleteProject,
  getAllProjects,
  updateProjectStatus,
  getAllSprintsProjects,
  deleteSprint,
  addSprintApi,
  addXPPhaseApi,
} from "@/api/project";
import toast from "react-hot-toast";

//@GET - get all projects
export function useProjects() {
  return useQuery<Project[], Error>({
    queryKey: ["projects"],
    queryFn: getAllProjects,
    staleTime: 1000 * 60 * 5, // optional: 5 min cache
  });
}

//@POST - add new project
export function useAddProjects() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addNewProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

// @DELETE - delete project
export function useDeleteProjects() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

// @PATCH - update project status
export function useUpdateProjectStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      status,
    }: {
      projectId: string;
      status: string;
    }) => updateProjectStatus(projectId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

// @POST - add project member
export function useAddProjectMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      userId,
    }: {
      projectId: string;
      userId: string;
    }) => addProjectMember(projectId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

// @GET - get all sprints wrt projectId
export function useFetchSprints(projectId: string) {
  return useQuery({
    queryKey: ["sprints", projectId], // cache key
    queryFn: () => getAllSprintsProjects(projectId),
    enabled: !!projectId, // only run if id exists
  });
}

// @DELETE - delete sprint
export function useDeleteSprint(projectId: string, sprintId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sprintId: string) => deleteSprint(sprintId),
    onSuccess: (data, sprintId) => {
      if (data.success) {

        // invalidate sprint list for this project
        queryClient.invalidateQueries({ queryKey: ["sprints", projectId] });

        // also clear sprint tasks cache if that sprint was open
        queryClient.removeQueries({ queryKey: ["sprintTasks", sprintId] });
        toast.success(data.message || "Sprint deleted successfully");
      }
    }
  });
}

// @POST - add new sprint
export function useAddSprint(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { name: string; startDate: string; endDate: string }) =>
      addSprintApi(projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sprints", projectId] });
    },
  });
}

export function useAddXPPhase(onSuccess?: () => void) {
  return useMutation({
    mutationFn: addXPPhaseApi,
    onSuccess: (data) => {
      toast.success(data.message || "XP phase added successfully");
      if (onSuccess) onSuccess();
    }
  });
}
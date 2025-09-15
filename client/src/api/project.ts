import axiosInstance from "@/app/lib/axiosInstance";
import { handleError } from "@/app/lib/handleError";
import { Project } from "@/types/project";
import {
  ProjectFormData,
  projectValidation,
} from "@/validations/projectValidation";

interface AddXPPhasePayload {
  projectId: string;
  taskId: string;
  currentPhase: string;
  priority: string;
  description: string;
  designNotes?: string;
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    const response = await axiosInstance.get("/api/v1/project/all-project");
    return response.data.projects;
  } catch (error) {
    handleError(error, "Failed to fetch tasks");
    throw error;
  }
}

export async function addNewProject(form: ProjectFormData) {
  try {
    const validate = projectValidation.parse(form);
    const response = await axiosInstance.post(
      "/api/v1/project/post-project",
      validate
    );
    console.log("Add Project Response:", response);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to add project");
    throw error;
  }
}

export async function deleteProject(id: string) {
  try {
    const response = await axiosInstance.delete(
      `/api/v1/project/delete-project/${id}`
    );
    return response.data;
  } catch (error) {
    handleError(error, "Failed to delete project");
    throw error;
  }
}

// Update project status
export async function updateProjectStatus(projectId: string, status: string) {
  try {
    const response = await axiosInstance.patch(
      `/api/v1/project/project-status/${projectId}`,
      { status }
    );
    return response.data;
  } catch (error) {
    handleError(error, "Failed to update project status");
    throw error;
  }
}

// Add member to project
export async function addProjectMember(projectId: string, userId: string) {
  try {
    const response = await axiosInstance.patch(
      `/api/v1/project/add-new-member/${projectId}`,
      { userId }
    );
    return response.data;
  } catch (error) {
    handleError(error, "Failed to add member to project");
    throw error;
  }
}

export async function getAllSprintsProjects(projectId: string) {
  try {
    const response = await axiosInstance.get(
      `/api/v1/sprint/all-sprints/${projectId}`
    );
    console.log("FROM API", response.data);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch sprints");
    throw error;
  }
}

export const addSprintApi = async (
  projectId: string,
  payload: { name: string; startDate: string; endDate: string }
) => {
  try {
    console.log("projectID", projectId, payload);
    const { data } = await axiosInstance.post(
      `/api/v1/sprint/add-sprint/${projectId}`,
      payload 
    );
    console.log("THIS IS addSprintAPI", data);
    return data;
  } catch (error) {
    handleError(error, "Failed to add sprint");
    throw error;
  }
};
export async function deleteSprint(sprintId: string) {
  try {
    const response = await axiosInstance.delete(
      `/api/v1/sprint/delete-sprint/${sprintId}`
    );
    return response.data; // { success, message }
  } catch (error) {
    handleError(error, "Failed to delete sprint");
    throw error;
  }
}

export const addXPPhaseApi = async (payload: AddXPPhasePayload) => {
  try {
    const { data } = await axiosInstance.post("/api/v1/xproute/xp", payload);
  console.log("addXPPhaseApi response:", data);
  return data;
  } catch (error) {
    handleError(error, "Failed to add XP Phase");
    throw error;
  }
};
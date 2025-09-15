import axiosInstance from "@/app/lib/axiosInstance";
import { handleError } from "@/app/lib/handleError";
import { Task, AddTaskPayload } from "@/types/task";
import { TaskFormData } from "@/validations/taskvalidation";

export async function getAllTasks(): Promise<Task[]> {
  try {
    const response = await axiosInstance.get("/api/v1/tasks/alltask");
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch tasks");
    throw error;
  }
}

export async function getAllProjectTasks(projectId: string): Promise<Task[]> {
  try {
    const response = await axiosInstance.get(
      `/api/v1/tasks/getTask/${projectId}`
    );
    const tasks: Task[] = response.data.getTasks || [];

    const statusMap: Record<string, Task["status"]> = {
      todo: "todo",
      "to do": "todo",
      todolist: "todo",
      inprogress: "inProgress",
      "in progress": "inProgress",
      done: "done",
      completed: "done",
    };

    const normalizedTasks = tasks.map((task) => {
      const rawStatus = (task.status || "").toLowerCase().trim();
      const status = statusMap[rawStatus] || "todo"; // default fallback
      return { ...task, status };
    });

    return normalizedTasks;
  } catch (error) {
    handleError(error, "Failed to fetch tasks");
    throw error;
  }
}

export async function updateTaskStatus(taskId: string, status: Task["status"]) {
  try {
    const response = await axiosInstance.patch(
      `/api/v1/tasks/patchTask/${taskId}/move`,
      { status }
    );
    return response.data;
  } catch (error) {
    handleError(error, "Failed to update task status");
    throw error;
  }
}

export async function addTask(payload: TaskFormData): Promise<Task> {
  try {
    const response = await axiosInstance.post("/api/v1/tasks/add-new-task", payload);
    if (!response.data.success) throw new Error("Failed to add task");
    return response.data.task;
  } catch (error) {
    handleError(error, "Failed to add task");
    throw error;
  }
}

export async function fetchTaskForSprints(sprintId: string) {
  try {
    const response = await axiosInstance.get(`/api/v1/tasks/get-task-sprint/${sprintId}`);
    console.log("fetchTaskforSprints", response);
    const tasks: Task[] = response.data.tasks || [];

    // normalize status values
    const statusMap: Record<string, Task["status"]> = {
      todo: "todo",
      "to do": "todo",
      todolist: "todo",
      inprogress: "inProgress",
      "in progress": "inProgress",
      done: "done",
      completed: "done",
    };

    const normalizedTasks = tasks.map((task) => {
      const rawStatus = (task.status || "").toLowerCase().trim();
      const status = statusMap[rawStatus] || "todo"; // fallback to todo
      return { ...task, status };
    });

    // group by status
    const groupedTasks = {
      todo: normalizedTasks.filter((t) => t.status === "todo"),
      inProgress: normalizedTasks.filter((t) => t.status === "inProgress"),
      done: normalizedTasks.filter((t) => t.status === "done"),
    };

    return groupedTasks;
  } catch (error) {
    handleError(error, "Failed to fetch tasks for sprint");
    throw error;
  }
}


export const assignSprintApi = async (
  sprintId: string,
  taskIds: string[]
) => {
  try {
    const { data } = await axiosInstance.patch("/api/v1/tasks/assign-sprint", {
      sprintId,
      taskIds,
    });
    return data;
  } catch (error) {
    handleError(error, "Failed to assign tasks to sprint");
    throw error;
  }
};

export const getAllXPTaskPhases = async (projectId: string) => {
  try {
    const { data } = await axiosInstance.get(`/api/v1/xproute/xp-phase/${projectId}`);
    return data.xpPhases;
  } catch (error) {
    handleError(error, "Failed to fetch xp task phases");
    throw error;
  }
};

export const deleteTask = async (taskId: string) => {
  try {
     const res = await axiosInstance.delete(`/api/v1/tasks/deleteTask/${taskId}`);
  return taskId; // return ID so we can use it in optimistic updates
  } catch (error) {
      handleError(error, "Failed to fetch xp task phases");
    throw error;
  }
}
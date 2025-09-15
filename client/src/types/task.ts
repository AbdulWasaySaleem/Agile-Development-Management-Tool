export interface Task {
  _id: string
  title: string
  description?: string
  status: string
  methodology?: string
  currentPhase?: string
  assignedBy?: string
  assignedTo?: string
  createdAt: string
  updatedAt: string
}

export interface AddTaskPayload {
  title: string;
  description?: string;
  assignedBy: string;
  assignedTo: string; // projectId
}
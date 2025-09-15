import { z } from "zod";

export const taskValidation = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  assignedBy: z.string().min(1, "assignedBy is required"),
  assignedTo: z.string().min(1, "assignedTo is required"),
  methodology: z.enum(["Scrum", "Kanban", "XP"]),
  methodologySpecific: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["todo", "inProgress", "done"]).default("todo"),
});

export type TaskFormData = z.infer<typeof taskValidation>;

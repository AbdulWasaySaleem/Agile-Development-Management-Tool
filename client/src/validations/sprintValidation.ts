import { z } from "zod";

export const sprintSchema = z.object({
  name: z.string().min(3, "Sprint name must be at least 3 characters"),
  startDate: z.string().nonempty("Start date is required"),
  endDate: z.string().nonempty("End date is required"),
}).refine((data) => {
  return new Date(data.endDate) >= new Date(data.startDate);
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

export const assignSprintSchema = z.object({
  sprintId: z.string().nonempty("Sprint is required"),
  taskIds: z.array(z.string()).min(1, "Select at least one task"),
});

export type SprintFormData = z.infer<typeof sprintSchema>;
export type AssignSprintFormData = z.infer<typeof assignSprintSchema>;

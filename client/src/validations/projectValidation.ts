import { z } from "zod";

export const projectValidation = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  startDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Invalid start date"),
  endDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Invalid end date"),
  methodology: z.enum(["Scrum", "Kanban", "XP"], {
    errorMap: () => ({ message: "Invalid methodology" }),
  }),
  status: z
    .enum([
      "Not Started",
      "In Progress",
      "Completed", // frontend values
      "not started",
      "in progress",
      "completed", // backend values
    ])
    .transform((val) => {
      switch (val.toLowerCase()) {
        case "not started":
          return "not started";
        case "in progress":
          return "in progress";
        case "completed":
          return "completed";
        default:
          return val;
      }
    }),

  members: z.array(z.string()).min(1, "At least one member is required"),
});

export type ProjectFormData = z.infer<typeof projectValidation>;

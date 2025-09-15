import { ZodError } from "zod"

export const getErrorMessage = (err: unknown) => {
  if (err instanceof ZodError) {
    return err.issues[0]?.message || "Invalid input"
  }
   if (err instanceof Error) {
    return err.message;
  }
  return "Something went wrong"
}

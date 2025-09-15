import axiosInstance from "@/app/lib/axiosInstance";
import { handleError } from "@/app/lib/handleError";

export async function getUserProfile(userID: string) {
  try {
    const response = await axiosInstance.get(`/api/v1/auth/userprofile/${userID}`);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch user profile");
    throw error;
  }
}
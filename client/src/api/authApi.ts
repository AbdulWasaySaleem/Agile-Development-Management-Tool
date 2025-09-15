import axiosInstance from "@/app/lib/axiosInstance";
import { handleError } from "@/app/lib/handleError";
import { LoginPayload, LoginResponse } from "@/types/auth";

export const loginApi = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  try {
    const { data } = await axiosInstance.post<LoginResponse>(
      "/api/v1/auth/login",
      payload
    );
    console.log("Login API response data:", data);
    return data;
  } catch (error) {
    handleError(error, "Login failed");
    throw error;
  }
};

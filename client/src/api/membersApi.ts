import axiosInstance from "@/app/lib/axiosInstance";
import { handleError } from "@/app/lib/handleError";
import { Member } from "@/types/member";

export async function getAllMembers(): Promise<Member[]> {
  try {
    const response = await axiosInstance.get("/api/v1/auth/all-users");
    return response.data.users;
  } catch (error) {
    handleError(error, "Failed to fetch members");
    throw error;
  }
}

export const fetchPendingUsersApi = async () => {
  try {
    const { data } = await axiosInstance.get("/api/v1/auth/pendinguser");
    return Array.isArray(data.user) ? data.user : [];
  } catch (error) {
    handleError(error, "Failed to fetch members");
    throw error;
  }
};

export const approveUserApi = async (id: string, role: string) => {
  try {
    const { data } = await axiosInstance.put(`/api/v1/auth/${id}/approve`, {
      role,
    });
    return data;
  } catch (error) {
    handleError(error, "Failed to approve members");
    throw error;
  }
};

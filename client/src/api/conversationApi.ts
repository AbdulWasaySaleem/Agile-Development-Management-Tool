import axiosInstance from "@/app/lib/axiosInstance";
import { handleError } from "@/app/lib/handleError";
import { Conversation } from "@/types/conversations";

export type AllConversations = Conversation[];

export async function getAllConversations(): Promise<AllConversations[]> {
  try {
    const response = await axiosInstance.get("/api/usermessage");
    console.log("getAllConversations",response);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch conversations");
    throw error;
  }
}

export async function sendMessage(conversationId: string, message: string) {
  try {
    const response = await axiosInstance.post(
      `/api/message/send/${conversationId}`,
      { message }
    );
    console.log("sendMessage",response);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to send conversations");
    throw error;
  }
}

export async function getUserMessages(conversationId: string) {
  try {
    const response = await axiosInstance.get(`/api/message/${conversationId}`);
    console.log("getUserMessages",response);
    return response.data;
  } catch (error) {
    handleError(error, "Failed to fetch messages");
    throw error;
  }
}
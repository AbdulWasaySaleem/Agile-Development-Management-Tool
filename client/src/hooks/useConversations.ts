import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getAllConversations, getUserMessages, sendMessage } from "@/api/conversationApi"
import { Conversation } from "@/types/conversations"
import toast from "react-hot-toast"
import useConversation from "@/app/store/useConversation"

export type AllConversations = Conversation[]


export function useConversations() {
  return useQuery<AllConversations>({
    queryKey: ["conversations"],
    queryFn: getAllConversations,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { selectedConversation, setMessages, messages } = useConversation();
  console.log("Selected Conversation in hook:", selectedConversation);

  return useMutation({
    mutationFn: (message: string) => {
      if (!selectedConversation?.id) throw new Error("No conversation selected");
      console.log(message)
      return sendMessage(selectedConversation.id, message);
    },
    onSuccess: (data) => {
      if (data.error) {
        toast.error(data.error);
        return;
      }

      // Update Zustand store (local state)
      setMessages([...messages, data]);

      // Invalidate messages query (keeps React Query in sync)
      queryClient.invalidateQueries({
        queryKey: ["messages", selectedConversation?.id],
      });
    }
  });
};

export const useGetMessages = () => {
  const { selectedConversation, messages, setMessages } = useConversation();

  const query = useQuery({
    queryKey: ["messages", selectedConversation?.id], // cache per conversation
    queryFn: () => getUserMessages(selectedConversation!.id),
    enabled: !!selectedConversation?.id, // only fetch if a convo is selected
    onSuccess: (data) => {
      setMessages(data); // keep Zustand store in sync
    },
    onError: (error: any) => {
      toast.error("Something went wrong while fetching messages");
      console.error("Error in useGetMessages:", error);
    },
  });

  return {
    ...query,
    messages, // Zustand version (keeps UI reactive to local updates)
  };
};
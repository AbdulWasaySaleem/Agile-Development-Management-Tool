import { create } from "zustand";
import { Conversation } from "@/types/conversations";

type SelectedConversation = Conversation | null;

interface ConversationStore {
  selectedConversation: SelectedConversation;
  setSelectedConversation: (conversation: SelectedConversation) => void;
  messages: any[];
  setMessages: (messages: any[]) => void;
}

const useConversation = create<ConversationStore>((set) => ({
  selectedConversation: null,
  setSelectedConversation: (conversation: SelectedConversation) =>
    set({ selectedConversation: conversation }),
  messages: [],
  setMessages: (messages: any[]) => set({ messages }),
}));

export default useConversation;
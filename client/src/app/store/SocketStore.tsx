// store/useSocketStore.ts
import { create } from "zustand";
import io, { Socket } from "socket.io-client";
import { useAuthStore } from "./authStore";

interface SocketState {
  socket: Socket | null;
  onlineUsers: string[];
  initializeSocket: () => void;
  disconnectSocket: () => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  onlineUsers: [],

  initializeSocket: () => {
    const { user } = useAuthStore.getState();
    if (!user?.id) return;

    // Disconnect existing socket
    get().socket?.disconnect();

    const socket = io(process.env.NEXT_PUBLIC_API_URL, {
      query: { userId: user.id },
    });

    socket.on("connect", () => console.log("Socket connected:", socket.id));

    socket.on("getOnlineUsers", (users: string[]) => {
      set({ onlineUsers: users });
      console.log("Online users updated:", users);
    });

    socket.on("disconnect", () => console.log("Socket disconnected"));

    set({ socket });
  },

  disconnectSocket: () => {
    get().socket?.disconnect();
    set({ socket: null, onlineUsers: [] });
  },
}));

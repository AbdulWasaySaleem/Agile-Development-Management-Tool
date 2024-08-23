import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./UserContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const [auth] = useAuth(); // Retrieve auth context

  useEffect(() => {
    if (auth && auth.user && auth.user.id) {
      // Initialize socket connection
      const socket = io("http://localhost:3001", {
        query: {
          userId: auth.user.id,
        },
      });

      // Store socket in state
      setSocket(socket);

      // Listen for online users
      socket.on("getOnlineUsers", (users) => {
        setOnlineUser(users);
      });

      // Clean up socket connection on component unmount
      return () => {
        socket.disconnect();
        setSocket(null); // Clear the socket reference
      };
    } else {
      // Handle case where auth is not available
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [auth]); // Run effect only when auth changes

  return (
    <SocketContext.Provider value={{ socket, onlineUser }}>
      {children}
    </SocketContext.Provider>
  );
};

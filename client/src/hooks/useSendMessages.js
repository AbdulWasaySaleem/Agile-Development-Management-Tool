import { useState } from "react";
import useConversation from "../zustand/useConversation";
import axios from "axios";
import { toast } from "react-toastify";

const useSendMessages = () => {
  const [loading, setLoading] = useState(false);  
  const { messages, setMessages, selectedConversation } = useConversation();

  const sendMessage = async (message) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `/api/message/send/${selectedConversation._id}`,
        { message },  
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      console.log("Response from useSendMessage", response.data);
      const data = response.data;

      if (data.error) throw new Error(data.error);
      setMessages([...messages, data]);
    } catch (error) {
      toast.error("Something went wrong");
      console.log("Error in useSendMessages", error);
    } finally {
      setLoading(false);  
    }
  };

  return { sendMessage, loading };
};

export default useSendMessages;

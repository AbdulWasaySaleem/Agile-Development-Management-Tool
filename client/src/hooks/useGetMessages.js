import React, { useEffect, useState } from 'react'
import useConversation from '../zustand/useConversation';
import axios from 'axios';
import { toast } from 'react-toastify';

const useGetMessages = () => {
  const [loadings, setLoading] = useState(false);  
  const { messages, setMessages, selectedConversation } = useConversation();

 useEffect(()=>{
  const getMessages = async ()=>{
    setLoading(true)
    try {
      const res = await axios.get(`/api/message/${selectedConversation._id}`)
      console.log("red",res);
      const data = await res.data 
      if(data.error) throw new Error(data.error)
      setMessages(data)
    } catch (error) {
      setLoading(false)
      console.log("Error on getMessages",error)
      toast.error("Something went wrong on getMessages")
    }finally{
      setLoading(false)
    }
  }
  if (selectedConversation?._id) getMessages()
 },[selectedConversation?._id,setMessages])

 return {messages,loadings}
}

export default useGetMessages
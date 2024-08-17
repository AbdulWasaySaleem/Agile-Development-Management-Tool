import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"

const useGetConversation = () => {
    const [loading, setLoading]= useState(false)
    const [conversations, setConversations] = useState([])

    useEffect(() => {
      const getConversations = async()=>{
        setLoading(true)
        try {
          const res = await axios.get('/api/usermessage')
          const data = res.data 
          if(data.error){ throw new Error(data.error)}
          setConversations(data)
          setLoading(false)
        } catch (error) {
          setLoading(false)
          toast.error(error.message)
        }
      }
    getConversations()
    }, [])

    return {loading, conversations}
    
}

export default useGetConversation
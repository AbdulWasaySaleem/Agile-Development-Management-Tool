import React from 'react'
import Divider from '../UI/Divider'
import useConversation from '../../zustand/useConversation'

const Conversation = ({conversation, lastIdx}) => {
  const {selectedConversation, setSelectedConversation} =useConversation()

  const isSelected = selectedConversation?._id === conversation._id
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[70%] max-h-[80%]">
      <div className="flex flex-col w-full">
        <div
           className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-600 w-full ${
             isSelected ? "bg-gray-700" : ""
           }`}
           onClick={() => setSelectedConversation(conversation)}
        >
          <img
            src={conversation.profilePicture.url}
            alt="User's profile"
            className="w-12 h-12 rounded-full"
          />
          <div className="flex flex-col">
            <p className="font-bold">{conversation.name}</p>
            <p className="text-sm text-gray-400">{conversation.role}</p>
          </div>
        </div>
      </div>
    </div>
    {!lastIdx && <Divider/>}
    </>
  )
}

export default Conversation
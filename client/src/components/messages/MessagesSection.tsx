"use client"


import useConversation from "@/app/store/useConversation"
import ChatWindow from "@/components/messages/conversations/ChatWindow"
import ConversationsSidebar from "@/components/messages/sidebar/Sidebar"

export default function MessagesSection() {
  const { selectedConversation } = useConversation()

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] border border-border rounded-xl overflow-hidden bg-background shadow-sm">
      {/* Sidebar - Improved responsive behavior and fixed width */}
      <div
        className={`
          w-80 max-w-[320px] min-w-0 border-r border-border bg-background
          transition-all duration-200 ease-in-out
          ${selectedConversation ? "hidden lg:flex" : "flex"}
          flex-col
        `}
      >
        <ConversationsSidebar />
      </div>

      {/* Chat area - Better flex handling and responsive visibility */}
      <div
        className={`
          flex-1 min-w-0 flex flex-col overflow-hidden
          ${!selectedConversation ? "hidden lg:flex items-center justify-center" : "flex"}
        `}
      >
        {!selectedConversation ? (
          <div className="flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
            <div className="text-lg font-medium mb-2">No conversation selected</div>
            <div className="text-sm">Choose a conversation from the sidebar to start chatting</div>
          </div>
        ) : (
          <ChatWindow />
        )}
      </div>
    </div>
  )
}

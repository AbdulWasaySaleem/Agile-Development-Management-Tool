"use client"

import { useSocketStore } from "@/app/store/SocketStore"
import useConversation from "@/app/store/useConversation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

interface ConversationCardProps {
  id: string
  name: string
  role: string
  profilePicture?: { url: string }
}

export default function ConversationCard({ id, name, role, profilePicture }: ConversationCardProps) {
  const { selectedConversation, setSelectedConversation } = useConversation()
  const { onlineUsers, initializeSocket } = useSocketStore()

  useEffect(() => {
    initializeSocket()
  }, [initializeSocket])

  const isSelected = selectedConversation?.id === id
  const isOnline = onlineUsers.includes(id)

  const handleClick = () => {
    setSelectedConversation({ id, name, role, profilePicture })
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex items-center gap-3 p-3 cursor-pointer transition-all duration-200 rounded-lg mx-1 my-0.5",
        "hover:bg-muted/80 active:scale-[0.98]",
        isSelected && "bg-muted shadow-sm border border-border/50",
      )}
    >
      <div className="relative flex-shrink-0">
        <Avatar className="h-10 w-10">
          <AvatarImage src={profilePicture?.url || "/placeholder.svg"} alt={`${name}'s avatar`} />
          <AvatarFallback className="text-sm font-medium">{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

        {/* Online/Offline Indicator - Better positioning and styling */}
        <div
          className={cn(
            "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-background transition-colors",
            isOnline ? "bg-green-500" : "bg-muted-foreground/40",
          )}
        />
      </div>

      {/* Content - Better text handling and responsive layout */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground text-sm truncate leading-tight">{name}</p>
        {role && <p className="text-xs text-muted-foreground truncate mt-0.5 leading-tight">{role}</p>}
      </div>
    </div>
  )
}

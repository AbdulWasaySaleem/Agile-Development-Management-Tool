"use client"

import { useEffect, useRef, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import useConversation from "@/app/store/useConversation"
import { ArrowLeft, Send, Loader2 } from "lucide-react"
import { useGetMessages, useSendMessage } from "@/hooks/useConversations"
import { useAuthStore } from "@/app/store/authStore"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import dayjs from "dayjs"

export default function ChatWindow() {
  const { selectedConversation, setSelectedConversation } = useConversation()
  const { user } = useAuthStore()
  const [text, setText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { mutate: sendMessage, isPending } = useSendMessage()
  const { data: messages } = useGetMessages()

  const handleSend = () => {
    if (!text.trim() || isPending) return
    sendMessage(text)
    setText("")
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
    return () => clearTimeout(timer)
  }, [messages])

  if (!selectedConversation) {
    return null
  }

  return (
    <div className="flex flex-col h-full bg-background min-h-0">
      {/* Header - Better mobile responsiveness and improved styling */}
      <div className="p-3 sm:p-4 border-b border-border flex items-center gap-3 flex-shrink-0 bg-background">
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden p-2 h-8 w-8"
          onClick={() => setSelectedConversation(null)}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>

        <Avatar className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0">
          <AvatarImage src={selectedConversation.profilePicture?.url || "/placeholder.svg"} />
          <AvatarFallback className="text-sm">{selectedConversation.name?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col min-w-0 flex-1">
          <span className="font-semibold text-sm sm:text-base text-foreground truncate">
            {selectedConversation.name ?? "Conversation"}
          </span>
          {selectedConversation.role && (
            <span className="text-xs text-muted-foreground truncate">{selectedConversation.role}</span>
          )}
        </div>
      </div>

      {/* Messages - Better message layout and responsive design */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-3 sm:p-4 space-y-4">
          {messages?.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages?.map((message: any) => {
              const isMe = message.senderId === user?.id
              return (
                <div
                  key={message._id}
                  className={`flex flex-col max-w-[85%] sm:max-w-[75%] md:max-w-[65%] ${
                    isMe ? "ml-auto items-end" : "mr-auto items-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-2xl text-sm leading-relaxed break-words ${
                      isMe
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }`}
                  >
                    {message.message}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 px-1">
                    {dayjs(message.createdAt).format("h:mm A")}
                  </span>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input - Better input design and improved send button */}
      <div className="p-3 sm:p-4 border-t border-border flex gap-2 items-end flex-shrink-0 bg-background">
        <div className="flex-1 min-w-0">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="text-sm resize-none min-h-[40px]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            disabled={isPending}
          />
        </div>
        <Button disabled={isPending || !text.trim()} onClick={handleSend} size="sm" className="h-10 px-3 flex-shrink-0">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span className="hidden sm:inline ml-1">{isPending ? "Sending" : "Send"}</span>
        </Button>
      </div>
    </div>
  )
}

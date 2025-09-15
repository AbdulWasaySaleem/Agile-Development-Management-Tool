"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useConversations } from "@/hooks/useConversations"
import { useState, useMemo } from "react"
import ConversationCard from "./Cards"

export default function ConversationsSidebar() {
  const { data: conversations } = useConversations()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredConversations = useMemo(() => {
    if (!conversations || !searchQuery.trim()) return conversations || []

    return conversations.filter(
      (conversation) =>
        conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conversation.role.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [conversations, searchQuery])

  return (
    <div className="h-full flex flex-col min-h-0">
      {/* Header - Improved spacing and search input with icon */}
      <div className="p-4 border-b border-border flex-shrink-0">
        <h2 className="font-semibold text-lg mb-3 text-foreground">Messages</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search conversations..."
            className="pl-9 text-sm h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Conversations List - Better scroll handling and empty state */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-2">
          {filteredConversations.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              {searchQuery ? "No conversations found" : "No conversations yet"}
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <ConversationCard
                key={conversation._id}
                id={conversation._id}
                name={conversation.name}
                role={conversation.role}
                profilePicture={conversation.profilePicture}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, Send } from "lucide-react"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { io, type Socket } from "socket.io-client"

interface ChatMessage {
  id: string
  user: {
    id: string
    name: string
    avatar?: string
    isHost: boolean
  }
  message: string
  timestamp: Date
}

interface LiveChatProps {
  streamId: string
  hostId: string
}

export default function LiveChat({ streamId, hostId }: LiveChatProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [message, setMessage] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Connect to socket server
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
      query: {
        streamId,
        userId: session?.user?.id || "guest",
        userName: session?.user?.name || "Guest",
        userAvatar: session?.user?.image || "",
      },
    })

    socketRef.current.on("connect", () => {
      setIsConnected(true)
    })

    socketRef.current.on("disconnect", () => {
      setIsConnected(false)
    })

    socketRef.current.on("chat_message", (message: ChatMessage) => {
      setMessages((prev) => [...prev, message])
    })

    socketRef.current.on("chat_history", (history: ChatMessage[]) => {
      setMessages(history)
    })

    return () => {
      socketRef.current?.disconnect()
    }
  }, [streamId, session])

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to chat",
        variant: "destructive",
      })
      return
    }

    if (!message.trim() || !isConnected) return

    socketRef.current?.emit("send_message", {
      streamId,
      message: message.trim(),
    })

    setMessage("")
  }

  // For demo purposes, simulate messages if no socket connection
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SOCKET_URL) {
      // Simulate initial messages
      const demoMessages: ChatMessage[] = [
        {
          id: "1",
          user: {
            id: "host",
            name: "Chef Maria",
            avatar: "/placeholder.svg?height=40&width=40",
            isHost: true,
          },
          message: "Welcome everyone! Today we're making homemade pasta from scratch.",
          timestamp: new Date(Date.now() - 300000),
        },
        {
          id: "2",
          user: {
            id: "user1",
            name: "Sarah",
            avatar: "/placeholder.svg?height=40&width=40",
            isHost: false,
          },
          message: "I'm excited to learn! I've never made pasta before.",
          timestamp: new Date(Date.now() - 240000),
        },
        {
          id: "3",
          user: {
            id: "user2",
            name: "Mike",
            avatar: "/placeholder.svg?height=40&width=40",
            isHost: false,
          },
          message: "What type of flour are you using?",
          timestamp: new Date(Date.now() - 180000),
        },
        {
          id: "4",
          user: {
            id: "host",
            name: "Chef Maria",
            avatar: "/placeholder.svg?height=40&width=40",
            isHost: true,
          },
          message:
            "I'm using '00' flour which is perfect for pasta. You can also use all-purpose flour if that's what you have.",
          timestamp: new Date(Date.now() - 120000),
        },
      ]

      setMessages(demoMessages)
      setIsConnected(true)
    }
  }, [])

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="bg-muted/30 rounded-lg p-4 h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Live Chat
        </h3>
        <Badge variant={isConnected ? "default" : "destructive"}>{isConnected ? "Connected" : "Disconnected"}</Badge>
      </div>

      <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
        {messages.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex gap-2">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={msg.user.avatar || ""} alt={msg.user.name} />
                <AvatarFallback>{msg.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-medium text-sm ${msg.user.isHost ? "text-primary" : ""}`}>
                    {msg.user.name}
                    {msg.user.isHost && (
                      <Badge variant="outline" className="ml-1 text-xs">
                        Host
                      </Badge>
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground">{formatTime(msg.timestamp)}</span>
                </div>
                <p className="text-sm">{msg.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <Separator className="my-2" />

      <form onSubmit={handleSendMessage} className="mt-auto">
        <div className="flex gap-2">
          <Input
            placeholder={session ? "Type a message..." : "Sign in to chat"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
            disabled={!session || !isConnected}
          />
          <Button type="submit" size="icon" disabled={!session || !isConnected || !message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}


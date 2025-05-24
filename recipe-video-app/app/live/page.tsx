"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Video, Users, MessageSquare, Send } from "lucide-react"

// Mock live streams
const liveStreams = [
  {
    id: "1",
    title: "Making Fresh Pasta from Scratch",
    host: {
      name: "Chef Maria",
      avatar: "/placeholder.svg?height=150&width=150",
    },
    thumbnail: "/placeholder.svg?height=720&width=1280",
    viewers: 1245,
    category: "Italian",
    isLive: true,
  },
  {
    id: "2",
    title: "Sunday Brunch Ideas",
    host: {
      name: "Breakfast King",
      avatar: "/placeholder.svg?height=150&width=150",
    },
    thumbnail: "/placeholder.svg?height=720&width=1280",
    viewers: 876,
    category: "Breakfast",
    isLive: true,
  },
  {
    id: "3",
    title: "Vegan Desserts Masterclass",
    host: {
      name: "Green Kitchen",
      avatar: "/placeholder.svg?height=150&width=150",
    },
    thumbnail: "/placeholder.svg?height=720&width=1280",
    viewers: 543,
    category: "Vegan",
    isLive: false,
    scheduledFor: "Tomorrow, 3:00 PM",
  },
]

// Mock chat messages for the active stream
const chatMessages = [
  {
    id: "1",
    user: {
      name: "Sarah",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    message: "What type of flour are you using?",
    timestamp: "2 min ago",
  },
  {
    id: "2",
    user: {
      name: "Mike",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    message: "I've been trying to make pasta for years but never got it right!",
    timestamp: "1 min ago",
  },
  {
    id: "3",
    user: {
      name: "Chef Maria",
      avatar: "/placeholder.svg?height=150&width=150",
      isHost: true,
    },
    message:
      "I'm using '00' flour which is perfect for pasta. You can also use all-purpose flour if that's what you have.",
    timestamp: "Just now",
  },
]

export default function LivePage() {
  const [activeStream, setActiveStream] = useState(liveStreams[0])
  const [chatMessage, setChatMessage] = useState("")
  const [goLiveMode, setGoLiveMode] = useState(false)
  const [streamTitle, setStreamTitle] = useState("")
  const [streamDescription, setStreamDescription] = useState("")
  const [streamCategory, setStreamCategory] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatMessage.trim()) return

    // In a real app, you would send this to your API
    alert(`Message sent: ${chatMessage}`)
    setChatMessage("")
  }

  const handleGoLive = (e: React.FormEvent) => {
    e.preventDefault()
    if (!streamTitle.trim()) return

    // In a real app, you would start the stream
    alert(`Going live with: ${streamTitle}`)
    setGoLiveMode(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Video className="h-6 w-6 text-red-500" />
          <h1 className="text-3xl font-bold">Live Cooking</h1>
        </div>
        <Button onClick={() => setGoLiveMode(!goLiveMode)}>{goLiveMode ? "Cancel" : "Go Live"}</Button>
      </div>

      {goLiveMode ? (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleGoLive} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="streamTitle" className="font-medium">
                  Stream Title
                </label>
                <Input
                  id="streamTitle"
                  placeholder="What are you cooking today?"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="streamDescription" className="font-medium">
                  Description
                </label>
                <Textarea
                  id="streamDescription"
                  placeholder="Tell viewers what to expect in your stream..."
                  value={streamDescription}
                  onChange={(e) => setStreamDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="streamCategory" className="font-medium">
                  Category
                </label>
                <Input
                  id="streamCategory"
                  placeholder="e.g., Italian, Breakfast, Vegan"
                  value={streamCategory}
                  onChange={(e) => setStreamCategory(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full">
                  Start Streaming
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Active Stream */}
            <div className="rounded-lg overflow-hidden bg-black">
              <AspectRatio ratio={16 / 9}>
                <div className="w-full h-full flex items-center justify-center relative">
                  <img
                    src={activeStream.thumbnail || "/placeholder.svg"}
                    alt={activeStream.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2 bg-red-500">LIVE</Badge>
                  <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-black/70 text-white px-2 py-1 rounded">
                    <Users className="h-4 w-4" />
                    <span>{activeStream.viewers} watching</span>
                  </div>
                </div>
              </AspectRatio>
            </div>

            <div>
              <h2 className="text-2xl font-bold">{activeStream.title}</h2>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={activeStream.host.avatar} alt={activeStream.host.name} />
                    <AvatarFallback>{activeStream.host.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{activeStream.host.name}</div>
                    <Badge variant="outline">{activeStream.category}</Badge>
                  </div>
                </div>
                <Button>Follow</Button>
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className="bg-muted/30 rounded-lg p-4 h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Live Chat
              </h3>
              <Badge variant="outline">{activeStream.viewers} viewers</Badge>
            </div>

            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {chatMessages.map((message) => (
                <div key={message.id} className="flex gap-2">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={message.user.avatar} alt={message.user.name} />
                    <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium text-sm ${message.user.isHost ? "text-primary" : ""}`}>
                        {message.user.name}
                        {message.user.isHost && (
                          <Badge variant="outline" className="ml-1 text-xs">
                            Host
                          </Badge>
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-2" />

            <form onSubmit={handleSendMessage} className="mt-auto">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!chatMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold mt-12 mb-6">More Live Streams</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {liveStreams.map((stream) => (
          <Card
            key={stream.id}
            className={`overflow-hidden hover:shadow-md transition-shadow ${activeStream.id === stream.id ? "border-primary" : ""}`}
          >
            <div className="cursor-pointer" onClick={() => stream.isLive && setActiveStream(stream)}>
              <div className="relative">
                <AspectRatio ratio={16 / 9}>
                  <img
                    src={stream.thumbnail || "/placeholder.svg"}
                    alt={stream.title}
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
                {stream.isLive ? (
                  <>
                    <Badge className="absolute top-2 right-2 bg-red-500">LIVE</Badge>
                    <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      <Users className="h-3 w-3" />
                      <span>{stream.viewers}</span>
                    </div>
                  </>
                ) : (
                  <Badge className="absolute top-2 right-2" variant="outline">
                    Scheduled: {stream.scheduledFor}
                  </Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold line-clamp-1">{stream.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={stream.host.avatar} alt={stream.host.name} />
                    <AvatarFallback>{stream.host.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{stream.host.name}</span>
                </div>
                <Badge variant="outline" className="mt-2">
                  {stream.category}
                </Badge>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}


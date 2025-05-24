"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Search, Clock, Heart, MessageSquare, Bookmark } from "lucide-react"
import Link from "next/link"

// Mock data for videos
const mockVideos = [
  {
    id: "1",
    title: "Perfect Homemade Pizza",
    author: "Chef Maria",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    views: "245K",
    likes: 15432,
    comments: 342,
    duration: "12:45",
    category: "Italian",
    timeAgo: "2 weeks ago",
  },
  {
    id: "2",
    title: "30-Minute Pasta Dishes",
    author: "Cooking with Alex",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    views: "189K",
    likes: 8765,
    comments: 231,
    duration: "18:22",
    category: "Quick Meals",
    timeAgo: "3 days ago",
  },
  {
    id: "3",
    title: "Vegan Dessert Masterclass",
    author: "Green Kitchen",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    views: "132K",
    likes: 6543,
    comments: 187,
    duration: "24:10",
    category: "Vegan",
    timeAgo: "1 month ago",
  },
  {
    id: "4",
    title: "Authentic Thai Curry",
    author: "Spice Master",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    views: "98K",
    likes: 4321,
    comments: 156,
    duration: "15:30",
    category: "Asian",
    timeAgo: "2 days ago",
  },
  {
    id: "5",
    title: "Breakfast Ideas for Busy Mornings",
    author: "Rise & Shine Cooking",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    views: "176K",
    likes: 7654,
    comments: 210,
    duration: "10:15",
    category: "Breakfast",
    timeAgo: "1 week ago",
  },
  {
    id: "6",
    title: "Gourmet Burgers at Home",
    author: "Burger Boss",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    views: "205K",
    likes: 9876,
    comments: 278,
    duration: "16:40",
    category: "American",
    timeAgo: "5 days ago",
  },
]

// Categories for filtering
const categories = [
  "All",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Vegan",
  "Quick Meals",
  "Italian",
  "Asian",
  "American",
]

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [activeTab, setActiveTab] = useState("all")

  // Filter videos based on search query and active category
  const filteredVideos = mockVideos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "All" || video.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Browse Recipes</h1>
        <div className="relative w-full md:w-auto md:min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search recipes or creators"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Videos</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="newest">Newest</TabsTrigger>
          <TabsTrigger value="popular">Most Popular</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos
              .sort((a, b) => b.likes - a.likes)
              .slice(0, 3)
              .map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="newest" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos
              .sort((a, b) => a.timeAgo.localeCompare(b.timeAgo))
              .map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="popular" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos
              .sort((a, b) => Number.parseInt(b.views) - Number.parseInt(a.views))
              .map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No videos found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter to find what you're looking for</p>
        </div>
      )}
    </div>
  )
}

function VideoCard({ video }: { video: (typeof mockVideos)[0] }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/video/${video.id}`}>
        <div className="relative">
          <AspectRatio ratio={16 / 9}>
            <img src={video.thumbnail || "/placeholder.svg"} alt={video.title} className="object-cover w-full h-full" />
          </AspectRatio>
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {video.duration}
          </div>
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/video/${video.id}`}>
          <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors">{video.title}</h3>
        </Link>
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <Link href={`/profile/${video.author}`} className="hover:text-primary transition-colors">
            {video.author}
          </Link>
          <span>{video.views} views</span>
        </div>
        <div className="flex justify-between mt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm">
              <Heart className="h-4 w-4" />
              <span>{video.likes}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <MessageSquare className="h-4 w-4" />
              <span>{video.comments}</span>
            </div>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <Badge variant="outline">{video.category}</Badge>
          <div className="text-xs text-muted-foreground flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {video.timeAgo}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Clock } from "lucide-react"

// Mock data for recent uploads
const recentUploads = [
  {
    id: "1",
    title: "Quick Breakfast Smoothie Bowl",
    author: {
      name: "Emma Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    thumbnail: "/placeholder.svg?height=200&width=350",
    timeAgo: "2 hours ago",
  },
  {
    id: "2",
    title: "Homemade Sourdough Bread",
    author: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    thumbnail: "/placeholder.svg?height=200&width=350",
    timeAgo: "5 hours ago",
  },
  {
    id: "3",
    title: "Grilled Vegetable Platter",
    author: {
      name: "Sophia Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    thumbnail: "/placeholder.svg?height=200&width=350",
    timeAgo: "Yesterday",
  },
  {
    id: "4",
    title: "Chocolate Lava Cake",
    author: {
      name: "James Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    thumbnail: "/placeholder.svg?height=200&width=350",
    timeAgo: "2 days ago",
  },
]

export default function RecentUploads() {
  return (
    <section className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Recent Uploads</h2>
        <Link href="/recent" className="text-primary hover:underline">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recentUploads.map((upload) => (
          <Card key={upload.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <Link href={`/video/${upload.id}`}>
              <div className="relative h-40">
                <img
                  src={upload.thumbnail || "/placeholder.svg"}
                  alt={upload.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium line-clamp-2">{upload.title}</h3>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={upload.author.avatar} alt={upload.author.name} />
                      <AvatarFallback>{upload.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{upload.author.name}</span>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {upload.timeAgo}
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  )
}


import { Card, CardContent } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Link from "next/link"

// Mock data for featured videos
const featuredVideos = [
  {
    id: "1",
    title: "Perfect Homemade Pizza",
    author: "Chef Maria",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    views: "245K",
    duration: "12:45",
  },
  {
    id: "2",
    title: "30-Minute Pasta Dishes",
    author: "Cooking with Alex",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    views: "189K",
    duration: "18:22",
  },
  {
    id: "3",
    title: "Vegan Dessert Masterclass",
    author: "Green Kitchen",
    thumbnail: "/placeholder.svg?height=720&width=1280",
    views: "132K",
    duration: "24:10",
  },
]

export default function FeaturedVideos() {
  return (
    <section className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Featured Videos</h2>
        <Link href="/featured" className="text-primary hover:underline">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredVideos.map((video) => (
          <Link href={`/video/${video.id}`} key={video.id}>
            <Card className="overflow-hidden transition-all hover:shadow-lg">
              <div className="relative">
                <AspectRatio ratio={16 / 9}>
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="object-cover w-full h-full"
                  />
                </AspectRatio>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg line-clamp-1">{video.title}</h3>
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>{video.author}</span>
                  <span>{video.views} views</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}


import Link from "next/link"

interface RelatedVideo {
  _id: string
  title: string
  thumbnailUrl?: string
  user: {
    _id: string
    name: string
    avatar?: string
  }
  views: number
  createdAt: string
  duration: string
}

interface RelatedVideosProps {
  videos: RelatedVideo[]
}

export default function RelatedVideos({ videos }: RelatedVideosProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays < 1) {
      return "Today"
    } else if (diffDays === 1) {
      return "Yesterday"
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)} months ago`
    } else {
      return `${Math.floor(diffDays / 365)} years ago`
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Related Videos</h2>
      <div className="space-y-4">
        {videos.length === 0 ? (
          <p className="text-muted-foreground">No related videos found.</p>
        ) : (
          videos.map((video) => (
            <Link href={`/video/${video._id}`} key={video._id}>
              <div className="flex gap-3 group">
                <div className="relative flex-shrink-0 w-40">
                  <img
                    src={video.thumbnailUrl || "/placeholder.svg?height=720&width=1280"}
                    alt={video.title}
                    className="object-cover rounded-md w-full h-24"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                    {video.duration || "0:00"}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">{video.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{video.user.name}</p>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <span>{video.views.toLocaleString()} views</span>
                    <span className="mx-1">•</span>
                    <span>{formatDate(video.createdAt)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}


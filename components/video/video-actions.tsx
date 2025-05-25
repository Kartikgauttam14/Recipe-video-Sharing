"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ThumbsUp, ThumbsDown, Share2, Bookmark, Download } from "lucide-react"

interface VideoActionsProps {
  videoId: string
  likes: number
  isLiked: boolean
  isSaved: boolean
  views: number
  uploadDate: string
}

export default function VideoActions({
  videoId,
  likes: initialLikes,
  isLiked: initialIsLiked,
  isSaved: initialIsSaved,
  views,
  uploadDate,
}: VideoActionsProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [isSaved, setIsSaved] = useState(initialIsSaved)
  const [likesCount, setLikesCount] = useState(initialLikes)
  const [isLoading, setIsLoading] = useState(false)

  const handleLike = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like videos",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/videos/${videoId}/like`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to like/unlike video")
      }

      const data = await response.json()

      setIsLiked(data.liked)
      setLikesCount((prev) => (data.liked ? prev + 1 : prev - 1))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like/unlike video",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save videos",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/videos/${videoId}/save`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to save/unsave video")
      }

      const data = await response.json()

      setIsSaved(data.saved)

      toast({
        title: data.saved ? "Video saved" : "Video removed from saved",
        description: data.saved
          ? "This video has been added to your saved videos"
          : "This video has been removed from your saved videos",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save/unsave video",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Video link copied to clipboard",
      })
    }
  }

  const handleDownload = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to download videos",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/videos/${videoId}/download`)

      if (!response.ok) {
        throw new Error("Failed to generate download link")
      }

      const data = await response.json()

      // Create a temporary link and trigger download
      const a = document.createElement("a")
      a.href = data.downloadUrl
      a.download = "recipe-video.mp4"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      toast({
        title: "Download started",
        description: "Your video download has started",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download video",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="mb-6 mt-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-4">
          <span>{views.toLocaleString()} views</span>
          <span>{formatDate(uploadDate)}</span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1 ${isLiked ? "text-primary" : ""}`}
            onClick={handleLike}
            disabled={isLoading}
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{likesCount.toLocaleString()}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <ThumbsDown className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1 ${isSaved ? "text-primary" : ""}`}
            onClick={handleSave}
            disabled={isLoading}
          >
            <Bookmark className="h-4 w-4" />
            <span>{isSaved ? "Saved" : "Save"}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1"
            onClick={handleDownload}
            disabled={isLoading}
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
        </div>
      </div>
    </div>
  )
}


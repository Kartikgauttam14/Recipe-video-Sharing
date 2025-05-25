"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ThumbsUp, ThumbsDown, Send, MessageSquare } from "lucide-react"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"

interface Comment {
  _id: string
  text: string
  user: {
    _id: string
    name: string
    avatar?: string
  }
  likes: string[]
  createdAt: string
  replies: Comment[]
}

interface CommentSectionProps {
  videoId: string
}

export default function CommentSection({ videoId }: CommentSectionProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [replyText, setReplyText] = useState<Record<string, string>>({})
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [videoId])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments/${videoId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch comments")
      }
      const data = await response.json()
      setComments(data)
    } catch (error) {
      console.error("Error fetching comments:", error)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment",
        variant: "destructive",
      })
      return
    }

    if (!newComment.trim()) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: newComment,
          videoId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add comment")
      }

      setNewComment("")
      fetchComments()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add comment",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReplySubmit = async (commentId: string) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to reply",
        variant: "destructive",
      })
      return
    }

    const replyContent = replyText[commentId]
    if (!replyContent?.trim()) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: replyContent,
          videoId,
          parentId: commentId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add reply")
      }

      setReplyText((prev) => ({ ...prev, [commentId]: "" }))
      setReplyingTo(null)
      fetchComments()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add reply",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleReply = (commentId: string) => {
    if (replyingTo === commentId) {
      setReplyingTo(null)
    } else {
      setReplyingTo(commentId)
      if (!replyText[commentId]) {
        setReplyText((prev) => ({ ...prev, [commentId]: "" }))
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffSecs < 60) {
      return "Just now"
    } else if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        Comments ({comments.length})
      </h2>

      <form onSubmit={handleCommentSubmit} className="mb-6">
        <div className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
            <AvatarFallback>{session?.user?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder={session ? "Add a comment..." : "Sign in to comment"}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-2"
              disabled={!session || isLoading}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={!session || isLoading || !newComment.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Comment
              </Button>
            </div>
          </div>
        </div>
      </form>

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="space-y-4">
              <div className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={comment.user.avatar || ""} alt={comment.user.name} />
                  <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{comment.user.name}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p>{comment.text}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      <span>{comment.likes.length}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-sm"
                      onClick={() => toggleReply(comment._id)}
                    >
                      Reply
                    </Button>
                  </div>

                  {replyingTo === comment._id && (
                    <div className="mt-4 flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
                        <AvatarFallback>{session?.user?.name?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          placeholder="Write a reply..."
                          value={replyText[comment._id] || ""}
                          onChange={(e) => setReplyText((prev) => ({ ...prev, [comment._id]: e.target.value }))}
                          className="mb-2 text-sm"
                          disabled={!session || isLoading}
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleReply(comment._id)}
                            disabled={isLoading}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleReplySubmit(comment._id)}
                            disabled={!session || isLoading || !replyText[comment._id]?.trim()}
                          >
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="pl-14 space-y-4">
                  {comment.replies.map((reply) => (
                    <div key={reply._id} className="flex gap-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={reply.user.avatar || ""} alt={reply.user.name} />
                        <AvatarFallback>{reply.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{reply.user.name}</span>
                          <span className="text-xs text-muted-foreground">{formatDate(reply.createdAt)}</span>
                        </div>
                        <p>{reply.text}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            <span>{reply.likes.length}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Separator />
            </div>
          ))
        )}
      </div>
    </div>
  )
}


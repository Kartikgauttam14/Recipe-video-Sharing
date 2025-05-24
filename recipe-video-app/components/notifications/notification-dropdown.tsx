"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NotificationType } from "@/models/Notification"

interface Notification {
  _id: string
  type: NotificationType
  sender: {
    _id: string
    name: string
    avatar?: string
  }
  video?: {
    _id: string
    title: string
    thumbnailUrl?: string
  }
  comment?: string
  read: boolean
  createdAt: string
}

export default function NotificationDropdown() {
  const { data: session } = useSession()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (session && isOpen) {
      fetchNotifications()
    }
  }, [session, isOpen])

  const fetchNotifications = async () => {
    if (!session) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/notifications?unread=true")
      if (!response.ok) {
        throw new Error("Failed to fetch notifications")
      }

      const data = await response.json()
      setNotifications(data)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAllAsRead = async () => {
    if (!session || notifications.length === 0) return

    try {
      const response = await fetch("/api/notifications", {
        method: "PUT",
      })

      if (!response.ok) {
        throw new Error("Failed to mark notifications as read")
      }

      // Update local state
      setNotifications(notifications.map((notif) => ({ ...notif, read: true })))
    } catch (error) {
      console.error("Error marking notifications as read:", error)
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    // Navigate based on notification type
    switch (notification.type) {
      case NotificationType.COMMENT:
      case NotificationType.LIKE:
        if (notification.video?._id) {
          router.push(`/video/${notification.video._id}`)
        }
        break
      case NotificationType.SUBSCRIBE:
        router.push(`/profile/${notification.sender._id}`)
        break
      case NotificationType.LIVE:
        router.push(`/live`)
        break
      default:
        break
    }

    setIsOpen(false)
  }

  const getNotificationText = (notification: Notification) => {
    switch (notification.type) {
      case NotificationType.COMMENT:
        return `${notification.sender.name} commented on your video "${notification.video?.title || "a video"}"`
      case NotificationType.LIKE:
        return `${notification.sender.name} liked your video "${notification.video?.title || "a video"}"`
      case NotificationType.SUBSCRIBE:
        return `${notification.sender.name} subscribed to your channel`
      case NotificationType.LIVE:
        return `${notification.sender.name} started a live stream`
      default:
        return "New notification"
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
      return `${diffMins}m ago`
    } else if (diffHours < 24) {
      return `${diffHours}h ago`
    } else if (diffDays < 7) {
      return `${diffDays}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  if (!session) return null

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 px-1 min-w-[18px] h-[18px] flex items-center justify-center"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {isLoading ? (
          <div className="py-6 text-center text-muted-foreground">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">No new notifications</div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification._id}
              className={`flex items-start gap-2 p-3 cursor-pointer ${!notification.read ? "bg-muted/50" : ""}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <Avatar className="h-8 w-8 mt-1">
                <AvatarImage src={notification.sender.avatar || ""} alt={notification.sender.name} />
                <AvatarFallback>{notification.sender.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm">{getNotificationText(notification)}</p>
                <p className="text-xs text-muted-foreground mt-1">{formatDate(notification.createdAt)}</p>
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


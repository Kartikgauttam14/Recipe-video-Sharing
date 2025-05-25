import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongoose"
import Video from "@/models/Video"
import Notification from "@/models/Notification"
import { NotificationType } from "@/models/Notification"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const userId = session.user.id

    await dbConnect()

    const video = await Video.findById(id)

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    // Check if user already liked the video
    const alreadyLiked = video.likes.includes(userId)

    if (alreadyLiked) {
      // Unlike the video
      await Video.findByIdAndUpdate(id, {
        $pull: { likes: userId },
      })

      return NextResponse.json({
        message: "Video unliked successfully",
        liked: false,
      })
    } else {
      // Like the video
      await Video.findByIdAndUpdate(id, {
        $addToSet: { likes: userId },
      })

      // Create notification if the user is not the video owner
      if (video.user.toString() !== userId) {
        await Notification.create({
          recipient: video.user,
          sender: userId,
          type: NotificationType.LIKE,
          video: id,
        })
      }

      return NextResponse.json({
        message: "Video liked successfully",
        liked: true,
      })
    }
  } catch (error) {
    console.error("Error liking/unliking video:", error)
    return NextResponse.json({ error: "Failed to like/unlike video" }, { status: 500 })
  }
}


import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongoose"
import Comment from "@/models/Comment"
import Video from "@/models/Video"
import Notification from "@/models/Notification"
import { NotificationType } from "@/models/Notification"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { text, videoId, parentId } = await req.json()

    if (!text || !videoId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await dbConnect()

    const video = await Video.findById(videoId)

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    const comment = await Comment.create({
      text,
      user: session.user.id,
      video: videoId,
      parent: parentId || null,
    })

    // If this is a reply to another comment, add it to the parent's replies
    if (parentId) {
      await Comment.findByIdAndUpdate(parentId, {
        $push: { replies: comment._id },
      })
    }

    // Add comment to video's comments array
    await Video.findByIdAndUpdate(videoId, {
      $push: { comments: comment._id },
    })

    // Create notification if the user is not the video owner
    if (video.user.toString() !== session.user.id) {
      await Notification.create({
        recipient: video.user,
        sender: session.user.id,
        type: NotificationType.COMMENT,
        video: videoId,
        comment: comment._id,
      })
    }

    // Populate user data for the response
    const populatedComment = await Comment.findById(comment._id).populate("user", "name avatar").lean()

    return NextResponse.json({ message: "Comment added successfully", comment: populatedComment }, { status: 201 })
  } catch (error) {
    console.error("Error adding comment:", error)
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
  }
}


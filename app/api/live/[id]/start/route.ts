import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongoose"
import LiveStream from "@/models/LiveStream"
import Notification from "@/models/Notification"
import User from "@/models/User"
import { NotificationType } from "@/models/Notification"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    await dbConnect()

    const liveStream = await LiveStream.findById(id)

    if (!liveStream) {
      return NextResponse.json({ error: "Live stream not found" }, { status: 404 })
    }

    // Check if user is the owner of the live stream
    if (liveStream.user.toString() !== session.user.id) {
      return NextResponse.json({ error: "Not authorized to start this live stream" }, { status: 403 })
    }

    // Check if stream is already active
    if (liveStream.isActive) {
      return NextResponse.json({ error: "Live stream is already active" }, { status: 400 })
    }

    // Update stream to active
    const updatedLiveStream = await LiveStream.findByIdAndUpdate(
      id,
      {
        isActive: true,
        viewers: 0,
      },
      { new: true },
    )

    // Notify subscribers if not already notified
    const user = await User.findById(session.user.id)

    if (user && user.subscribers > 0) {
      // Find users who are subscribed to this user
      const subscribers = await User.find({
        subscribedTo: session.user.id,
      })

      // Create notifications for each subscriber
      const notifications = subscribers.map((subscriber) => ({
        recipient: subscriber._id,
        sender: session.user.id,
        type: NotificationType.LIVE,
        video: null,
      }))

      if (notifications.length > 0) {
        await Notification.insertMany(notifications)
      }
    }

    return NextResponse.json({
      message: "Live stream started successfully",
      liveStream: updatedLiveStream,
    })
  } catch (error) {
    console.error("Error starting live stream:", error)
    return NextResponse.json({ error: "Failed to start live stream" }, { status: 500 })
  }
}


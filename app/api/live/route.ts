import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongoose"
import LiveStream from "@/models/LiveStream"
import { v4 as uuidv4 } from "uuid"
import Notification from "@/models/Notification"
import User from "@/models/User"
import { NotificationType } from "@/models/Notification"

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const active = url.searchParams.get("active") === "true"

    await dbConnect()

    const query: any = {}

    if (active) {
      query.isActive = true
    }

    const liveStreams = await LiveStream.find(query).sort({ createdAt: -1 }).populate("user", "name avatar").lean()

    return NextResponse.json(liveStreams)
  } catch (error) {
    console.error("Error fetching live streams:", error)
    return NextResponse.json({ error: "Failed to fetch live streams" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, thumbnailUrl, category, scheduledFor } = await req.json()

    if (!title || !description || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await dbConnect()

    // Generate a unique stream key
    const streamKey = uuidv4()

    const liveStream = await LiveStream.create({
      title,
      description,
      user: session.user.id,
      thumbnailUrl,
      streamKey,
      category,
      scheduledFor: scheduledFor || null,
      isActive: false,
    })

    // Notify subscribers
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

    return NextResponse.json({ message: "Live stream created", liveStream }, { status: 201 })
  } catch (error) {
    console.error("Error creating live stream:", error)
    return NextResponse.json({ error: "Failed to create live stream" }, { status: 500 })
  }
}


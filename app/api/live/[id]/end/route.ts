import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongoose"
import LiveStream from "@/models/LiveStream"
import Video from "@/models/Video"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const { saveAsVideo, videoUrl } = await req.json()

    await dbConnect()

    const liveStream = await LiveStream.findById(id)

    if (!liveStream) {
      return NextResponse.json({ error: "Live stream not found" }, { status: 404 })
    }

    // Check if user is the owner of the live stream
    if (liveStream.user.toString() !== session.user.id) {
      return NextResponse.json({ error: "Not authorized to end this live stream" }, { status: 403 })
    }

    // Check if stream is active
    if (!liveStream.isActive) {
      return NextResponse.json({ error: "Live stream is not active" }, { status: 400 })
    }

    // Update stream to inactive
    const updatedLiveStream = await LiveStream.findByIdAndUpdate(
      id,
      {
        isActive: false,
        endedAt: new Date(),
      },
      { new: true },
    )

    // Save as video if requested
    if (saveAsVideo && videoUrl) {
      await Video.create({
        title: liveStream.title,
        description: liveStream.description,
        videoUrl,
        thumbnailUrl: liveStream.thumbnailUrl,
        user: session.user.id,
        category: liveStream.category,
        tags: ["live-recording"],
      })
    }

    return NextResponse.json({
      message: "Live stream ended successfully",
      liveStream: updatedLiveStream,
    })
  } catch (error) {
    console.error("Error ending live stream:", error)
    return NextResponse.json({ error: "Failed to end live stream" }, { status: 500 })
  }
}


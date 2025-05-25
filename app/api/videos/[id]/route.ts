import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongoose"
import Video from "@/models/Video"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    await dbConnect()

    const video = await Video.findById(id).populate("user", "name avatar subscribers").lean()

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    // Increment view count
    await Video.findByIdAndUpdate(id, { $inc: { views: 1 } })

    return NextResponse.json(video)
  } catch (error) {
    console.error("Error fetching video:", error)
    return NextResponse.json({ error: "Failed to fetch video" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const updateData = await req.json()

    await dbConnect()

    const video = await Video.findById(id)

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    // Check if user is the owner of the video
    if (video.user.toString() !== session.user.id) {
      return NextResponse.json({ error: "Not authorized to update this video" }, { status: 403 })
    }

    const updatedVideo = await Video.findByIdAndUpdate(id, updateData, { new: true })

    return NextResponse.json(updatedVideo)
  } catch (error) {
    console.error("Error updating video:", error)
    return NextResponse.json({ error: "Failed to update video" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    await dbConnect()

    const video = await Video.findById(id)

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    // Check if user is the owner of the video
    if (video.user.toString() !== session.user.id) {
      return NextResponse.json({ error: "Not authorized to delete this video" }, { status: 403 })
    }

    await Video.findByIdAndDelete(id)

    return NextResponse.json({ message: "Video deleted successfully" })
  } catch (error) {
    console.error("Error deleting video:", error)
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 })
  }
}


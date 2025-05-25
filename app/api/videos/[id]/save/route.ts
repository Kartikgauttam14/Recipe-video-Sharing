import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongoose"
import User from "@/models/User"
import Video from "@/models/Video"

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

    const user = await User.findById(userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if video is already saved
    const alreadySaved = user.savedVideos.includes(id)

    if (alreadySaved) {
      // Unsave the video
      await User.findByIdAndUpdate(userId, {
        $pull: { savedVideos: id },
      })

      return NextResponse.json({
        message: "Video removed from saved videos",
        saved: false,
      })
    } else {
      // Save the video
      await User.findByIdAndUpdate(userId, {
        $addToSet: { savedVideos: id },
      })

      return NextResponse.json({
        message: "Video saved successfully",
        saved: true,
      })
    }
  } catch (error) {
    console.error("Error saving/unsaving video:", error)
    return NextResponse.json({ error: "Failed to save/unsave video" }, { status: 500 })
  }
}


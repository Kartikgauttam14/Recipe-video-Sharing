import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongoose"
import Video from "@/models/Video"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
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

    // In a real application, you would generate a signed URL for the video
    // or implement a proper download mechanism

    return NextResponse.json({
      message: "Download URL generated",
      downloadUrl: video.videoUrl,
    })
  } catch (error) {
    console.error("Error generating download URL:", error)
    return NextResponse.json({ error: "Failed to generate download URL" }, { status: 500 })
  }
}


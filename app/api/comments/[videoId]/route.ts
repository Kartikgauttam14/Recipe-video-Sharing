import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongoose"
import Comment from "@/models/Comment"

export async function GET(req: NextRequest, { params }: { params: { videoId: string } }) {
  try {
    const { videoId } = params

    await dbConnect()

    // Get top-level comments (no parent)
    const comments = await Comment.find({
      video: videoId,
      parent: null,
    })
      .sort({ createdAt: -1 })
      .populate("user", "name avatar")
      .populate({
        path: "replies",
        populate: {
          path: "user",
          select: "name avatar",
        },
      })
      .lean()

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}


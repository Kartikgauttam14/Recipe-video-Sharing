import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongoose"
import LiveStream from "@/models/LiveStream"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    await dbConnect()

    const liveStream = await LiveStream.findById(id).populate("user", "name avatar subscribers").lean()

    if (!liveStream) {
      return NextResponse.json({ error: "Live stream not found" }, { status: 404 })
    }

    // Increment viewer count if stream is active
    if (liveStream.isActive) {
      await LiveStream.findByIdAndUpdate(id, {
        $inc: { viewers: 1 },
      })
    }

    return NextResponse.json(liveStream)
  } catch (error) {
    console.error("Error fetching live stream:", error)
    return NextResponse.json({ error: "Failed to fetch live stream" }, { status: 500 })
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

    const liveStream = await LiveStream.findById(id)

    if (!liveStream) {
      return NextResponse.json({ error: "Live stream not found" }, { status: 404 })
    }

    // Check if user is the owner of the live stream
    if (liveStream.user.toString() !== session.user.id) {
      return NextResponse.json({ error: "Not authorized to update this live stream" }, { status: 403 })
    }

    const updatedLiveStream = await LiveStream.findByIdAndUpdate(id, updateData, { new: true })

    return NextResponse.json(updatedLiveStream)
  } catch (error) {
    console.error("Error updating live stream:", error)
    return NextResponse.json({ error: "Failed to update live stream" }, { status: 500 })
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

    const liveStream = await LiveStream.findById(id)

    if (!liveStream) {
      return NextResponse.json({ error: "Live stream not found" }, { status: 404 })
    }

    // Check if user is the owner of the live stream
    if (liveStream.user.toString() !== session.user.id) {
      return NextResponse.json({ error: "Not authorized to delete this live stream" }, { status: 403 })
    }

    await LiveStream.findByIdAndDelete(id)

    return NextResponse.json({ message: "Live stream deleted successfully" })
  } catch (error) {
    console.error("Error deleting live stream:", error)
    return NextResponse.json({ error: "Failed to delete live stream" }, { status: 500 })
  }
}


import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { put } from "@vercel/blob"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    const fileType = formData.get("fileType") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"]
    const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]

    if (fileType === "video" && !validVideoTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid video file type" }, { status: 400 })
    }

    if (fileType === "image" && !validImageTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid image file type" }, { status: 400 })
    }

    // Generate a unique filename
    const uniqueId = uuidv4()
    const extension = file.name.split(".").pop()
    const filename = `${fileType}/${session.user.id}/${uniqueId}.${extension}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
    })

    return NextResponse.json({
      url: blob.url,
      success: true,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}


import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongoose"
import Video from "@/models/Video"

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const page = Number.parseInt(url.searchParams.get("page") || "1")
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")
    const category = url.searchParams.get("category")
    const search = url.searchParams.get("search")

    const skip = (page - 1) * limit

    await dbConnect()

    const query: any = {}

    // Add category filter if provided
    if (category && category !== "All") {
      query.category = category
    }

    // Add search filter if provided
    if (search) {
      query.$text = { $search: search }
    }

    const videos = await Video.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name avatar")
      .lean()

    const total = await Video.countDocuments(query)

    return NextResponse.json({
      videos,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching videos:", error)
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const {
      title,
      description,
      videoUrl,
      thumbnailUrl,
      category,
      tags,
      ingredients,
      instructions,
      prepTime,
      cookTime,
      servings,
    } = await req.json()

    // Validate required fields
    if (!title || !description || !videoUrl || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await dbConnect()

    const video = await Video.create({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      user: session.user.id,
      category,
      tags: tags || [],
      ingredients: ingredients || [],
      instructions: instructions || [],
      prepTime,
      cookTime,
      servings,
    })

    return NextResponse.json({ message: "Video created successfully", video }, { status: 201 })
  } catch (error) {
    console.error("Error creating video:", error)
    return NextResponse.json({ error: "Failed to create video" }, { status: 500 })
  }
}


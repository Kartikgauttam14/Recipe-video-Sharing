import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongoose"
import Video from "@/models/Video"
import User from "@/models/User"
import VideoPlayer from "@/components/video/video-player"
import CommentSection from "@/components/video/comment-section"
import VideoActions from "@/components/video/video-actions"
import RelatedVideos from "@/components/video/related-videos"
import VideoInfo from "@/components/video/video-info"

interface VideoPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: VideoPageProps): Promise<Metadata> {
  await dbConnect()

  try {
    const video = await Video.findById(params.id).populate("user", "name").lean()

    if (!video) {
      return {
        title: "Video Not Found",
      }
    }

    return {
      title: `${video.title} - RecipeShare`,
      description: video.description,
      openGraph: {
        title: video.title,
        description: video.description,
        images: [{ url: video.thumbnailUrl || "/placeholder.svg" }],
      },
    }
  } catch (error) {
    return {
      title: "Video - RecipeShare",
    }
  }
}

export default async function VideoPage({ params }: VideoPageProps) {
  await dbConnect()

  const session = await getServerSession(authOptions)

  try {
    const video = await Video.findById(params.id).populate("user", "name avatar subscribers").lean()

    if (!video) {
      notFound()
    }

    // Check if user has saved this video
    let isSaved = false
    let isLiked = false

    if (session?.user?.id) {
      const user = await User.findById(session.user.id).lean()
      if (user) {
        isSaved = user.savedVideos.some((savedId) => savedId.toString() === params.id)
        isLiked = video.likes.some((likeId) => likeId.toString() === session.user.id)
      }
    }

    // Increment view count
    await Video.findByIdAndUpdate(params.id, { $inc: { views: 1 } })

    // Get related videos
    const relatedVideos = await Video.find({
      _id: { $ne: params.id },
      $or: [{ category: video.category }, { tags: { $in: video.tags } }],
    })
      .limit(6)
      .populate("user", "name avatar")
      .lean()

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Video Player */}
            <VideoPlayer
              videoUrl={video.videoUrl}
              thumbnailUrl={video.thumbnailUrl}
              allowDownload={true}
              onDownload={async () => {
                // This is handled client-side in the VideoPlayer component
              }}
            />

            {/* Video Actions */}
            <VideoActions
              videoId={params.id}
              likes={video.likes.length}
              isLiked={isLiked}
              isSaved={isSaved}
              views={video.views}
              uploadDate={video.createdAt}
            />

            {/* Video Info */}
            <VideoInfo
              title={video.title}
              description={video.description}
              author={{
                id: video.user._id.toString(),
                name: video.user.name,
                avatar: video.user.avatar,
                subscribers: video.user.subscribers,
              }}
              category={video.category}
              tags={video.tags}
              ingredients={video.ingredients}
              instructions={video.instructions}
              prepTime={video.prepTime}
              cookTime={video.cookTime}
              servings={video.servings}
            />

            {/* Comments Section */}
            <CommentSection videoId={params.id} />
          </div>

          {/* Sidebar - Related Videos */}
          <div>
            <RelatedVideos videos={relatedVideos} />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching video:", error)
    notFound()
  }
}


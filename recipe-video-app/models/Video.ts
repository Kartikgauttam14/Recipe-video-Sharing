import mongoose, { Schema, type Document } from "mongoose"

export interface IVideo extends Document {
  title: string
  description: string
  videoUrl: string
  thumbnailUrl: string
  user: mongoose.Types.ObjectId
  views: number
  likes: mongoose.Types.ObjectId[]
  comments: mongoose.Types.ObjectId[]
  duration: string
  category: string
  tags: string[]
  ingredients?: string[]
  instructions?: string[]
  prepTime?: string
  cookTime?: string
  servings?: number
  isLive: boolean
  liveEndedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const VideoSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      maxlength: [5000, "Description cannot be more than 5000 characters"],
    },
    videoUrl: {
      type: String,
      required: [true, "Please provide a video URL"],
    },
    thumbnailUrl: {
      type: String,
      default: "",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    duration: {
      type: String,
      default: "0:00",
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    ingredients: [
      {
        type: String,
        trim: true,
      },
    ],
    instructions: [
      {
        type: String,
        trim: true,
      },
    ],
    prepTime: {
      type: String,
    },
    cookTime: {
      type: String,
    },
    servings: {
      type: Number,
    },
    isLive: {
      type: Boolean,
      default: false,
    },
    liveEndedAt: {
      type: Date,
    },
  },
  { timestamps: true },
)

// Add text index for search functionality
VideoSchema.index({
  title: "text",
  description: "text",
  tags: "text",
  ingredients: "text",
})

export default mongoose.models.Video || mongoose.model<IVideo>("Video", VideoSchema)


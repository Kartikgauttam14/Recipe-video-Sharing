import mongoose, { Schema, type Document } from "mongoose"

export interface ILiveStream extends Document {
  title: string
  description: string
  user: mongoose.Types.ObjectId
  thumbnailUrl: string
  streamKey: string
  isActive: boolean
  viewers: number
  scheduledFor?: Date
  endedAt?: Date
  category: string
  createdAt: Date
  updatedAt: Date
}

const LiveStreamSchema: Schema = new Schema(
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
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
    thumbnailUrl: {
      type: String,
      default: "",
    },
    streamKey: {
      type: String,
      required: [true, "Stream key is required"],
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    viewers: {
      type: Number,
      default: 0,
    },
    scheduledFor: {
      type: Date,
    },
    endedAt: {
      type: Date,
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
    },
  },
  { timestamps: true },
)

export default mongoose.models.LiveStream || mongoose.model<ILiveStream>("LiveStream", LiveStreamSchema)


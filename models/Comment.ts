import mongoose, { Schema, type Document } from "mongoose"

export interface IComment extends Document {
  text: string
  user: mongoose.Types.ObjectId
  video: mongoose.Types.ObjectId
  likes: mongoose.Types.ObjectId[]
  parent?: mongoose.Types.ObjectId
  replies: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const CommentSchema: Schema = new Schema(
  {
    text: {
      type: String,
      required: [true, "Please provide comment text"],
      maxlength: [1000, "Comment cannot be more than 1000 characters"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: [true, "Please provide a video"],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true },
)

export default mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema)


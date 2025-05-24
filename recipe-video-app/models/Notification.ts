import mongoose, { Schema, type Document } from "mongoose"

export enum NotificationType {
  COMMENT = "comment",
  LIKE = "like",
  SUBSCRIBE = "subscribe",
  LIVE = "live",
}

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId
  sender: mongoose.Types.ObjectId
  type: NotificationType
  video?: mongoose.Types.ObjectId
  comment?: mongoose.Types.ObjectId
  read: boolean
  createdAt: Date
  updatedAt: Date
}

const NotificationSchema: Schema = new Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a recipient"],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a sender"],
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: [true, "Please provide a notification type"],
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

export default mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema)


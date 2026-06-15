import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId; // The user receiving the notification
  type: "join_request" | "request_accepted" | "request_rejected" | "match_cancelled" | "match_completed" | "friend_request" | "system" | "new_message" | "match_invite";
  message: string;
  relatedMatchId?: mongoose.Types.ObjectId; // Optional, for deep linking
  relatedUserId?: mongoose.Types.ObjectId; // Optional, the user who triggered it
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["join_request", "request_accepted", "request_rejected", "match_cancelled", "match_completed", "friend_request", "system", "new_message", "match_invite"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedMatchId: {
      type: Schema.Types.ObjectId,
      ref: "Match",
    },
    relatedUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// We usually want to show newest notifications first
NotificationSchema.index({ userId: 1, createdAt: -1 });

const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
  matchId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  text: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    matchId: {
      type: Schema.Types.ObjectId,
      ref: "Match",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    expiresAt: {
      type: Date,
      required: true,
      // MongoDB TTL index: delete document when current time >= expiresAt
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// We need to sort messages chronologically
MessageSchema.index({ matchId: 1, createdAt: 1 });

const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);

export default Message;

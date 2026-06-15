import mongoose, { Schema, Document, Model } from "mongoose";

export interface IJoinRequest extends Document {
  matchId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  hostId: mongoose.Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

const JoinRequestSchema = new Schema<IJoinRequest>(
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
    hostId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
      index: true,
    },
    message: {
      type: String,
      maxlength: 500,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent a user from sending multiple requests to the same match
JoinRequestSchema.index({ matchId: 1, userId: 1 }, { unique: true });

const JoinRequest: Model<IJoinRequest> =
  mongoose.models.JoinRequest || mongoose.model<IJoinRequest>("JoinRequest", JoinRequestSchema);

export default JoinRequest;

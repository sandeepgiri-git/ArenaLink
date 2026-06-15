import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  fromUserId: mongoose.Types.ObjectId;
  toUserId: mongoose.Types.ObjectId;
  matchId: mongoose.Types.ObjectId;
  rating: number; // 1 to 5
  attended: boolean; // Did the user show up?
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    matchId: {
      type: Schema.Types.ObjectId,
      ref: "Match",
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    attended: {
      type: Boolean,
      required: true,
      default: true,
    },
    feedback: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// A user can only review another user ONCE per match.
ReviewSchema.index({ fromUserId: 1, toUserId: 1, matchId: 1 }, { unique: true });

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

export default Review;

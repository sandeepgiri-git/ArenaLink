import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMatch extends Document {
  title: string;
  sport: string;
  description?: string;
  date: Date;
  time: string;
  location: string;
  playersNeeded: number;
  costPerPlayer: number;
  skillLevelRequired: "any" | "beginner" | "intermediate" | "advanced" | "pro";
  status: "open" | "full" | "completed" | "cancelled";
  hostId: mongoose.Types.ObjectId;
  playersJoined: mongoose.Types.ObjectId[];
  locationCoordinates?: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema = new Schema<IMatch>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    sport: {
      type: String,
      required: [true, "Sport is required"],
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      default: "",
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    playersNeeded: {
      type: Number,
      required: [true, "Number of players needed is required"],
      min: [1, "Must need at least 1 player"],
    },
    costPerPlayer: {
      type: Number,
      default: 0,
      min: [0, "Cost cannot be negative"],
    },
    skillLevelRequired: {
      type: String,
      enum: ["any", "beginner", "intermediate", "advanced", "pro"],
      default: "any",
    },
    status: {
      type: String,
      enum: ["open", "full", "completed", "cancelled"],
      default: "open",
    },
    hostId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Host is required"],
    },
    playersJoined: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    locationCoordinates: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
MatchSchema.index({ date: 1, time: 1 });
MatchSchema.index({ sport: 1 });
MatchSchema.index({ status: 1 });
MatchSchema.index({ hostId: 1 });
MatchSchema.index({ locationCoordinates: "2dsphere" });

const Match: Model<IMatch> =
  mongoose.models.Match || mongoose.model<IMatch>("Match", MatchSchema);

export default Match;

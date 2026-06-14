import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  emailVerified?: Date;
  username?: string;
  bio?: string;
  city?: string;
  age?: number;
  gender?: "male" | "female" | "other";
  sportsInterests: string[];
  skillLevel?: "beginner" | "intermediate" | "advanced" | "pro";
  matchesPlayed: number;
  rating: number;
  reliabilityScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      // Optional because OAuth users won't have a password
      select: false, // Don't include password in queries by default
    },
    image: {
      type: String,
      default: "",
    },
    emailVerified: {
      type: Date,
      default: null,
    },
    username: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
      trim: true,
      lowercase: true,
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ],
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
      default: "",
    },
    city: {
      type: String,
      trim: true,
      default: "",
    },
    age: {
      type: Number,
      min: [13, "Must be at least 13 years old"],
      max: [100, "Invalid age"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    sportsInterests: {
      type: [String],
      default: [],
    },
    skillLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "pro"],
      default: "beginner",
    },
    matchesPlayed: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reliabilityScore: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ city: 1 });
UserSchema.index({ sportsInterests: 1 });

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;

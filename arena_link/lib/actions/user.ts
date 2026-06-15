"use server";

import connectDB from "@/lib/db";
import User, { type IUser } from "@/models/User";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import Match from "@/models/Match";
import mongoose from "mongoose";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  image: string;
  username: string;
  bio: string;
  city: string;
  age: number | null;
  gender: string;
  sportsInterests: string[];
  skillLevel: string;
  matchesPlayed: number;
  rating: number;
  reliabilityScore: number;
  createdAt: string;
};

export async function getUserProfile(): Promise<UserProfile | null> {
  const session = await auth();
  if (!session?.user?.email) return null;

  try {
    await connectDB();
    const user = await User.findOne({ email: session.user.email }).lean<IUser>();
    if (!user) return null;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      image: user.image || "",
      username: user.username || "",
      bio: user.bio || "",
      city: user.city || "",
      age: user.age || null,
      gender: user.gender || "",
      sportsInterests: user.sportsInterests || [],
      skillLevel: user.skillLevel || "beginner",
      matchesPlayed: user.matchesPlayed || 0,
      rating: user.rating || 0,
      reliabilityScore: user.reliabilityScore || 100,
      createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

export async function getPublicProfile(userId: string): Promise<UserProfile | null> {
  try {
    await connectDB();
    const user = await User.findById(userId).lean<IUser>();
    if (!user) return null;

    return {
      id: user._id.toString(),
      name: user.name,
      email: "", // Hide email for public profile
      image: user.image || "",
      username: user.username || "",
      bio: user.bio || "",
      city: user.city || "",
      age: user.age || null,
      gender: user.gender || "",
      sportsInterests: user.sportsInterests || [],
      skillLevel: user.skillLevel || "beginner",
      matchesPlayed: user.matchesPlayed || 0,
      rating: user.rating || 0,
      reliabilityScore: user.reliabilityScore || 100,
      createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching public profile:", error);
    return null;
  }
}

export type UserStats = {
  totalMatchesPlayed: number;
  mostPlayedSport: string | null;
  hostCount: number;
};

export async function getUserStats(userId: string): Promise<UserStats> {
  try {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return { totalMatchesPlayed: 0, mostPlayedSport: null, hostCount: 0 };
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const today = new Date();

    // Find all matches the user has participated in (host or player) that are in the past
    const matches = await Match.find({
      $or: [{ hostId: userObjectId }, { playersJoined: userObjectId }],
      date: { $lt: today }
    }).lean().exec();

    let totalMatchesPlayed = matches.length;
    let hostCount = 0;
    const sportCounts: Record<string, number> = {};

    matches.forEach(m => {
      if (m.hostId.toString() === userId) {
        hostCount++;
      }
      sportCounts[m.sport] = (sportCounts[m.sport] || 0) + 1;
    });

    let mostPlayedSport = null;
    let maxCount = 0;
    for (const [sport, count] of Object.entries(sportCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostPlayedSport = sport;
      }
    }

    return { totalMatchesPlayed, mostPlayedSport, hostCount };
  } catch (error) {
    console.error("Error getting user stats:", error);
    return { totalMatchesPlayed: 0, mostPlayedSport: null, hostCount: 0 };
  }
}

const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .trim(),
  username: z
    .string()
    .max(30, "Username cannot exceed 30 characters")
    .regex(/^[a-zA-Z0-9_]*$/, "Only letters, numbers, and underscores")
    .trim()
    .optional()
    .or(z.literal("")),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional().or(z.literal("")),
  city: z.string().max(100, "City name too long").trim().optional().or(z.literal("")),
  age: z
    .union([z.coerce.number().min(13, "Must be at least 13").max(100, "Invalid age"), z.literal("")])
    .optional(),
  gender: z.enum(["male", "female", "other", ""]).optional(),
  sportsInterests: z.string().optional(), // comma-separated, parsed below
  skillLevel: z.enum(["beginner", "intermediate", "advanced", "pro"]).optional(),
});

export type ProfileUpdateState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
};

export async function updateUserProfile(
  _prevState: ProfileUpdateState,
  formData: FormData
): Promise<ProfileUpdateState> {
  const session = await auth();
  if (!session?.user?.email) {
    return { message: "You must be logged in to update your profile." };
  }

  const raw = {
    name: formData.get("name"),
    username: formData.get("username"),
    bio: formData.get("bio"),
    city: formData.get("city"),
    age: formData.get("age"),
    gender: formData.get("gender"),
    sportsInterests: formData.get("sportsInterests"),
    skillLevel: formData.get("skillLevel"),
  };

  const validatedFields = profileSchema.safeParse(raw);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Please check the fields.",
    };
  }

  const data = validatedFields.data;

  // Parse sports interests from comma-separated string
  const sportsInterests = data.sportsInterests
    ? data.sportsInterests
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  try {
    await connectDB();

    // Check username uniqueness if provided
    if (data.username) {
      const existingUser = await User.findOne({
        username: data.username.toLowerCase(),
        email: { $ne: session.user.email },
      });
      if (existingUser) {
        return {
          errors: { username: ["This username is already taken"] },
          message: "Username unavailable.",
        };
      }
    }

    const updateData: Record<string, unknown> = {
      name: data.name,
      bio: data.bio || "",
      city: data.city || "",
      sportsInterests,
      skillLevel: data.skillLevel || "beginner",
    };

    if (data.username) updateData.username = data.username.toLowerCase();
    if (typeof data.age === "number") updateData.age = data.age;
    if (data.gender) updateData.gender = data.gender;

    await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return { success: true, message: "Profile updated successfully!" };
  } catch (error) {
    console.error("Profile update error:", error);
    return { message: "Something went wrong. Please try again." };
  }
}

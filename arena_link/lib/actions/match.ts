"use server";

import connectDB from "@/lib/db";
import Match, { type IMatch } from "@/models/Match";
import User, { type IUser } from "@/models/User";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";

export type MatchDisplayData = {
  id: string;
  title: string;
  sport: string;
  description: string;
  date: string;
  time: string;
  location: string;
  playersNeeded: number;
  costPerPlayer: number;
  skillLevelRequired: string;
  status: string;
  playersJoinedCount: number;
  host: {
    id: string;
    name: string;
    image: string;
    rating: number;
  };
};

export type MatchCreateState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
};

const createMatchSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  sport: z.string().min(1, "Please select a sport"),
  description: z.string().max(1000).optional(),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  playersNeeded: z.coerce.number().min(1, "Need at least 1 player"),
  costPerPlayer: z.coerce.number().min(0, "Cost cannot be negative").default(0),
  skillLevelRequired: z.enum(["any", "beginner", "intermediate", "advanced", "pro"]).default("any"),
});

export async function createMatch(
  _prevState: MatchCreateState,
  formData: FormData
): Promise<MatchCreateState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: "You must be logged in to create a match." };
  }

  const raw = {
    title: formData.get("title"),
    sport: formData.get("sport"),
    description: formData.get("description"),
    date: formData.get("date"),
    time: formData.get("time"),
    location: formData.get("location"),
    playersNeeded: formData.get("playersNeeded"),
    costPerPlayer: formData.get("costPerPlayer"),
    skillLevelRequired: formData.get("skillLevelRequired"),
  };

  const validatedFields = createMatchSchema.safeParse(raw);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Please check the fields.",
    };
  }

  const data = validatedFields.data;

  try {
    await connectDB();

    const matchDate = new Date(data.date);
    
    // Check if the date is valid and not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (matchDate < today) {
      return {
        errors: { date: ["Date cannot be in the past"] },
        message: "Validation failed.",
      };
    }

    await Match.create({
      ...data,
      date: matchDate,
      hostId: new mongoose.Types.ObjectId(session.user.id),
      playersJoined: [],
      status: "open",
    });

    revalidatePath("/matches");
    revalidatePath("/dashboard");

    return { success: true, message: "Match created successfully!" };
  } catch (error) {
    console.error("Match creation error:", error);
    return { message: "Something went wrong. Please try again." };
  }
}

export async function getMatches(): Promise<MatchDisplayData[]> {
  try {
    await connectDB();

    // Find open matches from today onwards
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const matches = await Match.find({
      status: "open",
      date: { $gte: today },
    })
      .sort({ date: 1, time: 1 })
      .populate<{ hostId: IUser }>("hostId", "name image rating")
      .lean()
      .exec();

    // Map to a serializable format for Next.js Client Components
    return (matches as unknown as any[]).map((match) => ({
      id: match._id.toString(),
      title: match.title,
      sport: match.sport,
      description: match.description || "",
      date: match.date.toISOString(),
      time: match.time,
      location: match.location,
      playersNeeded: match.playersNeeded,
      costPerPlayer: match.costPerPlayer,
      skillLevelRequired: match.skillLevelRequired,
      status: match.status,
      playersJoinedCount: match.playersJoined?.length || 0,
      host: {
        id: match.hostId._id.toString(),
        name: match.hostId.name,
        image: match.hostId.image || "",
        rating: match.hostId.rating || 0,
      },
    }));
  } catch (error) {
    console.error("Failed to fetch matches:", error);
    return [];
  }
}

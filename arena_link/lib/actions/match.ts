"use server";

import connectDB from "@/lib/db";
import Match, { type IMatch } from "@/models/Match";
import User, { type IUser } from "@/models/User";
import Notification from "@/models/Notification";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { checkRateLimit, RateLimitError } from "@/lib/rateLimit";

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
  distanceInKm?: number;
  coordinates?: [number, number];
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
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
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
    lat: formData.get("lat") || undefined,
    lng: formData.get("lng") || undefined,
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

    // TODO: Activate this for production to prevent spam
    /*
    try {
      // Max 5 matches per day (86400 seconds)
      await checkRateLimit(`create_match_${session.user.id}`, 5, 86400);
    } catch (e) {
      if (e instanceof RateLimitError) {
        return { message: "You have reached the daily limit for creating matches." };
      }
    }
    */

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

    const matchData: any = {
      ...data,
      date: matchDate,
      hostId: new mongoose.Types.ObjectId(session.user.id),
      playersJoined: [],
      status: "open",
    };

    if (data.lat !== undefined && data.lng !== undefined && !isNaN(data.lat) && !isNaN(data.lng)) {
      matchData.locationCoordinates = {
        type: "Point",
        coordinates: [data.lng, data.lat], // GeoJSON order is [longitude, latitude]
      };
    }

    await Match.create(matchData);

    revalidatePath("/matches");
    revalidatePath("/dashboard");

    return { success: true, message: "Match created successfully!" };
  } catch (error) {
    console.error("Match creation error:", error);
    return { message: "Something went wrong. Please try again." };
  }
}

export async function getMatches(userLat?: number, userLng?: number): Promise<MatchDisplayData[]> {
  try {
    await connectDB();

    // Find open matches from today onwards
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let matches: any[];

    if (userLat !== undefined && userLng !== undefined && !isNaN(userLat) && !isNaN(userLng)) {
      // Use geospatial aggregation
      matches = await Match.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [userLng, userLat], // [longitude, latitude]
            },
            distanceField: "distance",
            distanceMultiplier: 0.001, // convert meters to kilometers
            query: { status: "open", date: { $gte: today } },
            spherical: true,
          },
        },
        { $sort: { distance: 1, date: 1, time: 1 } },
        {
          $lookup: {
            from: "users",
            localField: "hostId",
            foreignField: "_id",
            as: "hostId",
          },
        },
        { $unwind: "$hostId" },
      ]).exec();
    } else {
      // Standard fetch without location
      matches = await Match.find({
        status: "open",
        date: { $gte: today },
      })
        .sort({ date: 1, time: 1 })
        .populate<{ hostId: IUser }>("hostId", "name image rating")
        .lean()
        .exec();
    }

    // Map to a serializable format for Next.js Client Components
    return matches.map((match) => ({
      id: match._id.toString(),
      title: match.title,
      sport: match.sport,
      description: match.description || "",
      date: match.date instanceof Date ? match.date.toISOString() : new Date(match.date).toISOString(),
      time: match.time,
      location: match.location,
      playersNeeded: match.playersNeeded,
      costPerPlayer: match.costPerPlayer,
      skillLevelRequired: match.skillLevelRequired,
      status: match.status,
      playersJoinedCount: match.playersJoined?.length || 0,
      distanceInKm: match.distance !== undefined ? Number(match.distance.toFixed(1)) : undefined,
      coordinates: match.locationCoordinates?.coordinates || undefined,
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

export type PlayerDisplayData = {
  id: string;
  name: string;
  image: string;
  rating: number;
};

export type MatchDetailsData = MatchDisplayData & {
  playersJoined: PlayerDisplayData[];
};

export async function getMatchById(id: string): Promise<MatchDetailsData | null> {
  try {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    const match = await Match.findById(id)
      .populate<{ hostId: IUser }>("hostId", "name image rating")
      .populate<{ playersJoined: IUser[] }>("playersJoined", "name image rating")
      .lean()
      .exec();

    if (!match) return null;

    return {
      id: match._id.toString(),
      title: match.title,
      sport: match.sport,
      description: match.description || "",
      date: match.date instanceof Date ? match.date.toISOString() : new Date(match.date).toISOString(),
      time: match.time,
      location: match.location,
      playersNeeded: match.playersNeeded,
      costPerPlayer: match.costPerPlayer,
      skillLevelRequired: match.skillLevelRequired,
      status: match.status,
      playersJoinedCount: match.playersJoined?.length || 0,
      coordinates: match.locationCoordinates?.coordinates || undefined,
      host: {
        id: match.hostId._id.toString(),
        name: match.hostId.name,
        image: match.hostId.image || "",
        rating: match.hostId.rating || 0,
      },
      playersJoined: (match.playersJoined || []).map((p: any) => ({
        id: p._id.toString(),
        name: p.name,
        image: p.image || "",
        rating: p.rating || 0,
      })),
    };
  } catch (error) {
    console.error("Failed to fetch match:", error);
    return null;
  }
}

export async function getUserMatches(): Promise<{ upcoming: MatchDisplayData[], past: MatchDisplayData[], currentUserId: string | null }> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { upcoming: [], past: [], currentUserId: null };

    await connectDB();

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const matches = await Match.find({
      $or: [
        { hostId: userObjectId },
        { playersJoined: userObjectId }
      ]
    })
      .sort({ date: -1, time: -1 })
      .populate<{ hostId: IUser }>("hostId", "name image rating")
      .lean()
      .exec();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming: MatchDisplayData[] = [];
    const past: MatchDisplayData[] = [];

    matches.forEach(match => {
      const matchDate = new Date(match.date);
      const isPast = matchDate < today;

      const displayData: MatchDisplayData = {
        id: match._id.toString(),
        title: match.title,
        sport: match.sport,
        description: match.description || "",
        date: match.date instanceof Date ? match.date.toISOString() : new Date(match.date).toISOString(),
        time: match.time,
        location: match.location,
        playersNeeded: match.playersNeeded,
        costPerPlayer: match.costPerPlayer,
        skillLevelRequired: match.skillLevelRequired,
        status: match.status,
        playersJoinedCount: match.playersJoined?.length || 0,
        coordinates: match.locationCoordinates?.coordinates || undefined,
        host: {
          id: match.hostId._id.toString(),
          name: match.hostId.name,
          image: match.hostId.image || "",
          rating: match.hostId.rating || 0,
        },
      };

      if (isPast) {
        past.push(displayData);
      } else {
        upcoming.push(displayData);
      }
    });

    // Upcoming should be sorted ascending (closest first)
    upcoming.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    });

    return { upcoming, past, currentUserId: userId };
  } catch (error) {
    console.error("Failed to fetch user matches:", error);
    return { upcoming: [], past: [], currentUserId: null };
  }
}

export async function getHostedOpenMatches(): Promise<MatchDisplayData[]> {
  try {
    const session = await auth();
    if (!session?.user?.id) return [];

    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const matches = await Match.find({
      hostId: session.user.id,
      status: "open",
      date: { $gte: today }
    })
      .sort({ date: 1, time: 1 })
      .populate<{ hostId: IUser }>("hostId", "name image rating")
      .lean()
      .exec();

    return matches.map((match: any) => ({
      id: match._id.toString(),
      title: match.title,
      sport: match.sport,
      description: match.description || "",
      date: match.date instanceof Date ? match.date.toISOString() : new Date(match.date).toISOString(),
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
    console.error("Failed to fetch hosted matches:", error);
    return [];
  }
}

export async function inviteUserToMatch(matchId: string, targetUserId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized." };
    }

    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(matchId) || !mongoose.Types.ObjectId.isValid(targetUserId)) {
      return { success: false, message: "Invalid IDs." };
    }

    const match = await Match.findById(matchId);
    if (!match) {
      return { success: false, message: "Match not found." };
    }

    if (match.hostId.toString() !== session.user.id) {
      return { success: false, message: "Only the host can invite players." };
    }

    if (match.status !== "open") {
      return { success: false, message: "This match is no longer open." };
    }

    if (match.playersJoined.includes(new mongoose.Types.ObjectId(targetUserId))) {
      return { success: false, message: "Player is already in this match." };
    }

    // Check if notification already sent
    const existingInvite = await Notification.findOne({
      userId: targetUserId,
      type: "match_invite",
      relatedMatchId: matchId,
    });

    if (existingInvite) {
      return { success: false, message: "You already invited this player to this match." };
    }

    await Notification.create({
      userId: targetUserId,
      type: "match_invite",
      message: `${session.user.name || "A host"} invited you to join their match: ${match.title}`,
      relatedMatchId: matchId,
      relatedUserId: session.user.id,
    });

    return { success: true, message: "Invitation sent!" };
  } catch (error) {
    console.error("Failed to send invite:", error);
    return { success: false, message: "An error occurred." };
  }
}

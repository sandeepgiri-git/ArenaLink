"use server";

import connectDB from "@/lib/db";
import Match from "@/models/Match";
import User, { type IUser } from "@/models/User";
import Review from "@/models/Review";
import { auth } from "@/auth";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export type ParticipantDisplay = {
  id: string;
  name: string;
  image: string;
  role: "host" | "player";
  hasBeenRated: boolean;
};

export async function getMatchParticipantsToRate(matchId: string): Promise<{ success: boolean; participants: ParticipantDisplay[]; message?: string }> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { success: false, participants: [], message: "Unauthorized" };

    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(matchId)) {
      return { success: false, participants: [], message: "Invalid match ID" };
    }

    const match = await Match.findById(matchId)
      .populate<{ hostId: IUser }>("hostId", "name image")
      .populate<{ playersJoined: IUser[] }>("playersJoined", "name image")
      .exec();
    if (!match) {
      return { success: false, participants: [], message: "Match not found" };
    }

    // Verify current user was in this match
    const isHost = match.hostId._id.toString() === userId;
    const isPlayer = match.playersJoined.some((p: any) => p._id.toString() === userId);

    if (!isHost && !isPlayer) {
      return { success: false, participants: [], message: "You were not part of this match" };
    }

    // Get existing reviews from this user for this match
    const existingReviews = await Review.find({
      matchId,
      fromUserId: userId,
    }).lean();

    const ratedUserIds = new Set(existingReviews.map(r => r.toUserId.toString()));

    const participants: ParticipantDisplay[] = [];

    // Add host if current user is not host
    if (!isHost) {
      participants.push({
        id: match.hostId._id.toString(),
        name: match.hostId.name,
        image: match.hostId.image || "",
        role: "host",
        hasBeenRated: ratedUserIds.has(match.hostId._id.toString()),
      });
    }

    // Add players (excluding current user)
    match.playersJoined.forEach((p: any) => {
      const pid = p._id.toString();
      if (pid !== userId) {
        participants.push({
          id: pid,
          name: p.name,
          image: p.image || "",
          role: "player",
          hasBeenRated: ratedUserIds.has(pid),
        });
      }
    });

    return { success: true, participants };
  } catch (error) {
    console.error("Failed to get participants to rate:", error);
    return { success: false, participants: [], message: "Failed to load participants" };
  }
}

export async function submitReview(
  matchId: string,
  toUserId: string,
  rating: number,
  attended: boolean,
  feedback?: string
) {
  try {
    const session = await auth();
    const fromUserId = session?.user?.id;
    if (!fromUserId) return { success: false, message: "Unauthorized" };

    if (fromUserId === toUserId) {
      return { success: false, message: "You cannot rate yourself" };
    }

    await connectDB();

    // Check if review already exists
    const existing = await Review.findOne({ matchId, fromUserId, toUserId });
    if (existing) {
      return { success: false, message: "You have already rated this user for this match" };
    }

    // Create review
    await Review.create({
      matchId,
      fromUserId,
      toUserId,
      rating,
      attended,
      feedback: feedback ? feedback.substring(0, 500) : undefined,
    });

    // Update target user's stats
    const targetUser = await User.findById(toUserId);
    if (targetUser) {
      // Recalculate average rating
      const allReviews = await Review.find({ toUserId, attended: true }); // Only factor in attended games for rating
      if (allReviews.length > 0) {
        const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
        targetUser.rating = Number((sum / allReviews.length).toFixed(1));
      }

      // Update reliability score
      // Logic: Start at 100%. No-show = -10%. Attended = +2% (capped at 100%)
      if (attended) {
        targetUser.reliabilityScore = Math.min(100, targetUser.reliabilityScore + 2);
      } else {
        targetUser.reliabilityScore = Math.max(0, targetUser.reliabilityScore - 10);
      }

      // Increment matches played if this is the first review they're receiving for this match? 
      // Actually matchesPlayed should be incremented when match completes. But doing it loosely here or as a background job.
      // Let's just increment if they attended and it's their first review for this match.
      const matchReviews = await Review.countDocuments({ matchId, toUserId });
      if (matchReviews === 1 && attended) {
         targetUser.matchesPlayed = (targetUser.matchesPlayed || 0) + 1;
      }

      await targetUser.save();
    }

    revalidatePath(`/matches/${matchId}/rate`);
    revalidatePath(`/profile`);
    return { success: true, message: "Review submitted successfully!" };
  } catch (error) {
    console.error("Failed to submit review:", error);
    return { success: false, message: "An error occurred" };
  }
}

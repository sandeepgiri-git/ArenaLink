"use server";

import connectDB from "@/lib/db";
import JoinRequest from "@/models/JoinRequest";
import Match from "@/models/Match";
import { auth } from "@/auth";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { IUser } from "@/models/User";

export type JoinRequestDisplay = {
  id: string;
  userId: string;
  matchId: string;
  status: "pending" | "accepted" | "rejected";
  message: string;
  createdAt: string;
  user: {
    name: string;
    image: string;
    rating: number;
  };
};

export async function sendJoinRequest(matchId: string, message: string = "") {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "You must be logged in to join a match." };
    }

    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(matchId)) {
      return { success: false, message: "Invalid match ID." };
    }

    const match = await Match.findById(matchId);
    if (!match) {
      return { success: false, message: "Match not found." };
    }

    if (match.hostId.toString() === session.user.id) {
      return { success: false, message: "You cannot join your own match." };
    }

    if (match.status !== "open") {
      return { success: false, message: "This match is no longer open." };
    }

    if (match.playersJoined.includes(new mongoose.Types.ObjectId(session.user.id))) {
      return { success: false, message: "You have already joined this match." };
    }

    // Check if request already exists
    const existingRequest = await JoinRequest.findOne({
      matchId,
      userId: session.user.id,
    });

    if (existingRequest) {
      return { success: false, message: `You already have a ${existingRequest.status} request for this match.` };
    }

    await JoinRequest.create({
      matchId,
      userId: session.user.id,
      hostId: match.hostId,
      message: message.substring(0, 500),
    });

    revalidatePath(`/matches/${matchId}`);
    return { success: true, message: "Join request sent successfully!" };
  } catch (error) {
    console.error("Send join request error:", error);
    return { success: false, message: "Failed to send request. Please try again." };
  }
}

export async function getMatchRequests(matchId: string): Promise<JoinRequestDisplay[]> {
  try {
    const session = await auth();
    if (!session?.user?.id) return [];

    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(matchId)) return [];

    // Verify user is host
    const match = await Match.findById(matchId);
    if (!match || match.hostId.toString() !== session.user.id) {
      return [];
    }

    const requests = await JoinRequest.find({ matchId, status: "pending" })
      .populate<{ userId: IUser }>("userId", "name image rating")
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return requests.map((req: any) => ({
      id: req._id.toString(),
      userId: req.userId._id.toString(),
      matchId: req.matchId.toString(),
      status: req.status,
      message: req.message || "",
      createdAt: req.createdAt.toISOString(),
      user: {
        name: req.userId.name,
        image: req.userId.image || "",
        rating: req.userId.rating || 0,
      },
    }));
  } catch (error) {
    console.error("Get match requests error:", error);
    return [];
  }
}

export async function getUserRequestForMatch(matchId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return null;

    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(matchId)) return null;

    const request = await JoinRequest.findOne({
      matchId,
      userId: session.user.id,
    }).lean();

    if (!request) return null;

    return {
      id: request._id.toString(),
      status: request.status,
    };
  } catch (error) {
    console.error("Get user request error:", error);
    return null;
  }
}

export async function updateJoinRequestStatus(requestId: string, newStatus: "accepted" | "rejected") {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized." };
    }

    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return { success: false, message: "Invalid request ID." };
    }

    const request = await JoinRequest.findById(requestId);
    if (!request) {
      return { success: false, message: "Request not found." };
    }

    if (request.hostId.toString() !== session.user.id) {
      return { success: false, message: "Only the match host can update requests." };
    }

    if (request.status !== "pending") {
      return { success: false, message: `Request is already ${request.status}.` };
    }

    request.status = newStatus;
    await request.save();

    if (newStatus === "accepted") {
      const match = await Match.findById(request.matchId);
      if (match) {
        // Double check they aren't already in
        if (!match.playersJoined.includes(request.userId)) {
          match.playersJoined.push(request.userId);
          
          // Check if match is full now
          if (match.playersJoined.length >= match.playersNeeded) {
            match.status = "full";
          }
          await match.save();
        }
      }
    }

    revalidatePath(`/matches/${request.matchId}`);
    return { success: true, message: `Request ${newStatus} successfully.` };
  } catch (error) {
    console.error("Update request status error:", error);
    return { success: false, message: "Failed to update request." };
  }
}

"use server";

import connectDB from "@/lib/db";
import Message from "@/models/Message";
import Match from "@/models/Match";
import { auth } from "@/auth";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { IUser } from "@/models/User";

export type MessageDisplay = {
  id: string;
  matchId: string;
  userId: string;
  text: string;
  createdAt: string;
  user: {
    name: string;
    image: string;
  };
};

export async function sendMessage(matchId: string, text: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return { success: false, message: "Unauthorized." };
    }

    if (!text || text.trim().length === 0) {
      return { success: false, message: "Message cannot be empty." };
    }

    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(matchId)) {
      return { success: false, message: "Invalid match ID." };
    }

    const match = await Match.findById(matchId);
    if (!match) {
      return { success: false, message: "Match not found." };
    }

    // Verify user is part of the match (host or joined player)
    const isHost = match.hostId.toString() === userId;
    const isJoined = match.playersJoined.some(
      (pid: mongoose.Types.ObjectId) => pid.toString() === userId
    );

    if (!isHost && !isJoined) {
      return { success: false, message: "You are not a participant in this match." };
    }

    // Determine when messages should expire. 
    // Let's say they expire 24 hours after the match's scheduled date.
    // If the match date is missing or invalid, fallback to 48 hours from now.
    let expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 2); // default fallback

    if (match.date) {
      const matchDate = new Date(match.date);
      // add time to the matchDate if we want it precise, but adding 24 hours after midnight of the match date is fine
      matchDate.setDate(matchDate.getDate() + 1); // 1 day after match
      if (matchDate > new Date()) {
        expiresAt = matchDate;
      }
    }

    const newMsg = await Message.create({
      matchId,
      userId,
      text: text.trim().substring(0, 1000),
      expiresAt,
    });

    revalidatePath(`/matches/${matchId}`);
    return { success: true, message: "Message sent." };
  } catch (error) {
    console.error("Failed to send message:", error);
    return { success: false, message: "An error occurred." };
  }
}

export async function getMatchMessages(matchId: string): Promise<MessageDisplay[]> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return [];

    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(matchId)) return [];

    const match = await Match.findById(matchId);
    if (!match) return [];

    // Verify access
    const isHost = match.hostId.toString() === userId;
    const isJoined = match.playersJoined.some(
      (pid: mongoose.Types.ObjectId) => pid.toString() === userId
    );

    if (!isHost && !isJoined) return [];

    const messages = await Message.find({ matchId })
      .populate<{ userId: IUser }>("userId", "name image")
      .sort({ createdAt: 1 }) // Chronological order
      .lean()
      .exec();

    return messages.map((msg: any) => ({
      id: msg._id.toString(),
      matchId: msg.matchId.toString(),
      userId: msg.userId._id.toString(),
      text: msg.text,
      createdAt: msg.createdAt.toISOString(),
      user: {
        name: msg.userId.name,
        image: msg.userId.image || "",
      },
    }));
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return [];
  }
}

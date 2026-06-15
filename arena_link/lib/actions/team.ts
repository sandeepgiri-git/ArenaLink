"use server";

import connectDB from "@/lib/db";
import Team from "@/models/Team";
import User, { type IUser } from "@/models/User";
import { auth } from "@/auth";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export type TeamDisplay = {
  id: string;
  name: string;
  sport: string;
  logo: string;
  captain: {
    id: string;
    name: string;
    image: string;
  };
  members: {
    id: string;
    name: string;
    image: string;
    rating: number;
    reliabilityScore: number;
  }[];
  createdAt: string;
};

export async function createTeam(name: string, sport: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { success: false, message: "Unauthorized" };

    if (!name || !name.trim()) return { success: false, message: "Team name is required" };
    if (!sport || !sport.trim()) return { success: false, message: "Sport is required" };

    await connectDB();

    const team = await Team.create({
      name: name.trim(),
      sport: sport.trim(),
      captainId: userId,
      members: [userId], // captain is the first member
    });

    revalidatePath(`/teams`);
    return { success: true, teamId: team._id.toString() };
  } catch (error) {
    console.error("Failed to create team:", error);
    return { success: false, message: "Internal Error" };
  }
}

export async function getUserTeams(): Promise<{ success: boolean; teams: TeamDisplay[] }> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { success: false, teams: [] };

    await connectDB();

    const teams = await Team.find({ members: userId })
      .populate<{ captainId: IUser }>("captainId", "name image")
      .populate<{ members: IUser[] }>("members", "name image rating reliabilityScore")
      .sort({ createdAt: -1 })
      .lean();

    const displayTeams: TeamDisplay[] = teams.map(t => ({
      id: t._id.toString(),
      name: t.name,
      sport: t.sport,
      logo: t.logo || "",
      captain: {
        id: t.captainId._id.toString(),
        name: t.captainId.name,
        image: t.captainId.image || "",
      },
      members: t.members.map(m => ({
        id: m._id.toString(),
        name: m.name,
        image: m.image || "",
        rating: m.rating || 0,
        reliabilityScore: m.reliabilityScore || 100,
      })),
      createdAt: t.createdAt.toISOString(),
    }));

    return { success: true, teams: displayTeams };
  } catch (error) {
    console.error("Failed to get user teams:", error);
    return { success: false, teams: [] };
  }
}

export async function getTeamById(teamId: string): Promise<{ success: boolean; team?: TeamDisplay, message?: string }> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { success: false, message: "Unauthorized" };

    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return { success: false, message: "Invalid team ID" };
    }

    const t = await Team.findById(teamId)
      .populate<{ captainId: IUser }>("captainId", "name image")
      .populate<{ members: IUser[] }>("members", "name image rating reliabilityScore")
      .lean();

    if (!t) return { success: false, message: "Team not found" };

    // Check if user is a member
    const isMember = t.members.some(m => m._id.toString() === userId);
    if (!isMember) {
      return { success: false, message: "You are not a member of this team" };
    }

    const displayTeam: TeamDisplay = {
      id: t._id.toString(),
      name: t.name,
      sport: t.sport,
      logo: t.logo || "",
      captain: {
        id: t.captainId._id.toString(),
        name: t.captainId.name,
        image: t.captainId.image || "",
      },
      members: t.members.map(m => ({
        id: m._id.toString(),
        name: m.name,
        image: m.image || "",
        rating: m.rating || 0,
        reliabilityScore: m.reliabilityScore || 100,
      })),
      createdAt: t.createdAt.toISOString(),
    };

    return { success: true, team: displayTeam };
  } catch (error) {
    console.error("Failed to get team by id:", error);
    return { success: false, message: "Internal Error" };
  }
}

export async function addMemberToTeam(teamId: string, memberId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { success: false, message: "Unauthorized" };

    await connectDB();

    const team = await Team.findById(teamId);
    if (!team) return { success: false, message: "Team not found" };

    // Only captain can add members
    if (team.captainId.toString() !== userId) {
      return { success: false, message: "Only the captain can add members" };
    }

    if (team.members.includes(new mongoose.Types.ObjectId(memberId))) {
      return { success: false, message: "User is already in the team" };
    }

    team.members.push(new mongoose.Types.ObjectId(memberId));
    await team.save();

    revalidatePath(`/teams/${teamId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to add team member:", error);
    return { success: false, message: "Internal Error" };
  }
}

export async function removeMemberFromTeam(teamId: string, memberId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { success: false, message: "Unauthorized" };

    await connectDB();

    const team = await Team.findById(teamId);
    if (!team) return { success: false, message: "Team not found" };

    // Only captain can remove members, or members can leave themselves
    const isCaptain = team.captainId.toString() === userId;
    const isSelf = userId === memberId;
    
    if (!isCaptain && !isSelf) {
      return { success: false, message: "Unauthorized" };
    }

    if (team.captainId.toString() === memberId) {
      return { success: false, message: "Captain cannot leave the team. Delete the team instead." };
    }

    team.members = team.members.filter(id => id.toString() !== memberId);
    await team.save();

    revalidatePath(`/teams/${teamId}`);
    if (isSelf) {
      revalidatePath(`/teams`);
    }
    return { success: true };
  } catch (error) {
    console.error("Failed to remove team member:", error);
    return { success: false, message: "Internal Error" };
  }
}

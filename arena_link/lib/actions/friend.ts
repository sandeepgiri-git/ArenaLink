"use server";

import connectDB from "@/lib/db";
import Friendship from "@/models/Friendship";
import User, { type IUser } from "@/models/User";
import { auth } from "@/auth";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import Notification from "@/models/Notification";

export type FriendDisplay = {
  id: string; // The user ID
  friendshipId: string; // The relationship ID
  name: string;
  image: string;
  rating: number;
  reliabilityScore: number;
};

// Internal helper to enforce order
function getOrderedIds(id1: string, id2: string) {
  return id1 > id2 ? [id2, id1] : [id1, id2];
}

export async function getFriendshipStatus(targetUserId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId || !mongoose.Types.ObjectId.isValid(targetUserId)) {
      return { status: "none", requesterId: null };
    }

    if (userId === targetUserId) return { status: "self", requesterId: null };

    await connectDB();
    const [u1, u2] = getOrderedIds(userId, targetUserId);

    const friendship = await Friendship.findOne({ user1: u1, user2: u2 }).lean();
    if (!friendship) return { status: "none", requesterId: null };

    return { 
      status: friendship.status, 
      requesterId: friendship.requesterId.toString(),
      friendshipId: friendship._id.toString()
    };
  } catch (error) {
    console.error("Failed to get friendship status:", error);
    return { status: "error", requesterId: null };
  }
}

export async function sendFriendRequest(targetUserId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { success: false, message: "Unauthorized" };

    if (userId === targetUserId) return { success: false, message: "Cannot add yourself" };

    await connectDB();
    const [u1, u2] = getOrderedIds(userId, targetUserId);

    const existing = await Friendship.findOne({ user1: u1, user2: u2 });
    if (existing) {
      if (existing.status === "accepted") return { success: false, message: "Already friends" };
      if (existing.status === "pending") return { success: false, message: "Request already pending" };
      if (existing.status === "rejected" && existing.requesterId.toString() === userId) {
         return { success: false, message: "Previous request was rejected" };
      }
      
      // If the target had previously rejected, but now we allow them to re-request, we update
      existing.status = "pending";
      existing.requesterId = new mongoose.Types.ObjectId(userId);
      await existing.save();
    } else {
      await Friendship.create({
        user1: u1,
        user2: u2,
        requesterId: userId,
        status: "pending"
      });
    }

    // Send Notification
    await Notification.create({
      userId: targetUserId,
      type: "friend_request",
      message: `${session.user?.name || "Someone"} sent you a friend request.`,
      relatedUserId: userId,
    });

    revalidatePath(`/profile/${targetUserId}`);
    return { success: true, message: "Friend request sent!" };
  } catch (error) {
    console.error("Failed to send friend request:", error);
    return { success: false, message: "Internal Error" };
  }
}

export async function acceptFriendRequest(friendshipId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { success: false, message: "Unauthorized" };

    await connectDB();
    const friendship = await Friendship.findById(friendshipId);
    
    if (!friendship) return { success: false, message: "Request not found" };
    if (friendship.status !== "pending") return { success: false, message: "Request is not pending" };
    
    // Ensure the current user is NOT the requester (they are the recipient)
    if (friendship.requesterId.toString() === userId) {
      return { success: false, message: "You cannot accept your own request" };
    }
    
    // Ensure the current user is part of the friendship
    if (friendship.user1.toString() !== userId && friendship.user2.toString() !== userId) {
      return { success: false, message: "Unauthorized" };
    }

    friendship.status = "accepted";
    await friendship.save();

    // Send Notification back to requester
    await Notification.create({
      userId: friendship.requesterId.toString(),
      type: "system",
      message: `${session.user?.name || "Someone"} accepted your friend request!`,
      relatedUserId: userId,
    });

    revalidatePath(`/friends`);
    revalidatePath(`/profile/${friendship.requesterId.toString()}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to accept friend request:", error);
    return { success: false, message: "Internal Error" };
  }
}

export async function rejectFriendRequest(friendshipId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { success: false, message: "Unauthorized" };

    await connectDB();
    const friendship = await Friendship.findById(friendshipId);
    
    if (!friendship) return { success: false, message: "Request not found" };
    
    // If the requester cancels their own request
    if (friendship.requesterId.toString() === userId) {
       await friendship.deleteOne();
       revalidatePath(`/friends`);
       revalidatePath(`/profile`);
       return { success: true };
    }

    // Ensure the current user is part of the friendship
    if (friendship.user1.toString() !== userId && friendship.user2.toString() !== userId) {
      return { success: false, message: "Unauthorized" };
    }

    // Recipient rejecting
    friendship.status = "rejected";
    await friendship.save();

    revalidatePath(`/friends`);
    return { success: true };
  } catch (error) {
    console.error("Failed to reject friend request:", error);
    return { success: false, message: "Internal Error" };
  }
}

export async function removeFriend(friendshipId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { success: false, message: "Unauthorized" };

    await connectDB();
    const friendship = await Friendship.findById(friendshipId);
    
    if (!friendship) return { success: false, message: "Friendship not found" };

    if (friendship.user1.toString() !== userId && friendship.user2.toString() !== userId) {
      return { success: false, message: "Unauthorized" };
    }

    await friendship.deleteOne();
    revalidatePath(`/friends`);
    return { success: true };
  } catch (error) {
    console.error("Failed to remove friend:", error);
    return { success: false, message: "Internal Error" };
  }
}

export async function getFriends(): Promise<{ success: boolean; friends: FriendDisplay[] }> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { success: false, friends: [] };

    await connectDB();
    const friendships = await Friendship.find({
      $or: [{ user1: userId }, { user2: userId }],
      status: "accepted"
    }).populate<{ user1: IUser, user2: IUser }>("user1 user2", "name image rating reliabilityScore").lean();

    const friends: FriendDisplay[] = friendships.map(f => {
      // Find the user object that is NOT the current user
      const friendObj = f.user1._id.toString() === userId ? f.user2 : f.user1;
      
      return {
        id: friendObj._id.toString(),
        friendshipId: f._id.toString(),
        name: friendObj.name,
        image: friendObj.image || "",
        rating: friendObj.rating || 0,
        reliabilityScore: friendObj.reliabilityScore || 100,
      };
    });

    return { success: true, friends };
  } catch (error) {
    console.error("Failed to get friends:", error);
    return { success: false, friends: [] };
  }
}

export async function getPendingRequests(): Promise<{ success: boolean; incoming: FriendDisplay[], outgoing: FriendDisplay[] }> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { success: false, incoming: [], outgoing: [] };

    await connectDB();
    const pendingFriendships = await Friendship.find({
      $or: [{ user1: userId }, { user2: userId }],
      status: "pending"
    }).populate<{ user1: IUser, user2: IUser }>("user1 user2", "name image rating reliabilityScore").lean();

    const incoming: FriendDisplay[] = [];
    const outgoing: FriendDisplay[] = [];

    pendingFriendships.forEach(f => {
      const isRequester = f.requesterId.toString() === userId;
      const friendObj = f.user1._id.toString() === userId ? f.user2 : f.user1;
      
      const display: FriendDisplay = {
        id: friendObj._id.toString(),
        friendshipId: f._id.toString(),
        name: friendObj.name,
        image: friendObj.image || "",
        rating: friendObj.rating || 0,
        reliabilityScore: friendObj.reliabilityScore || 100,
      };

      if (isRequester) {
        outgoing.push(display);
      } else {
        incoming.push(display);
      }
    });

    return { success: true, incoming, outgoing };
  } catch (error) {
    console.error("Failed to get pending requests:", error);
    return { success: false, incoming: [], outgoing: [] };
  }
}

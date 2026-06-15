"use server";

import connectDB from "@/lib/db";
import Notification from "@/models/Notification";
import { auth } from "@/auth";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export type NotificationDisplay = {
  id: string;
  type: string;
  message: string;
  relatedMatchId?: string;
  relatedUserId?: string;
  isRead: boolean;
  createdAt: string;
};

export async function getUserNotifications(): Promise<NotificationDisplay[]> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return [];

    await connectDB();

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return notifications.map((notif: any) => ({
      id: notif._id.toString(),
      type: notif.type,
      message: notif.message,
      relatedMatchId: notif.relatedMatchId?.toString(),
      relatedUserId: notif.relatedUserId?.toString(),
      isRead: notif.isRead,
      createdAt: notif.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return [];
  }
}

export async function getUnreadNotificationCount(): Promise<number> {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return 0;

    await connectDB();

    const count = await Notification.countDocuments({ userId, isRead: false });
    return count;
  } catch (error) {
    console.error("Failed to fetch unread count:", error);
    return 0;
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { success: false, message: "Unauthorized." };

    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return { success: false, message: "Invalid ID." };
    }

    const result = await Notification.updateOne(
      { _id: notificationId, userId },
      { $set: { isRead: true } }
    );

    if (result.modifiedCount > 0) {
      revalidatePath("/notifications");
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    return { success: false, message: "An error occurred." };
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { success: false, message: "Unauthorized." };

    await connectDB();

    await Notification.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    );

    revalidatePath("/notifications");
    return { success: true };
  } catch (error) {
    console.error("Failed to mark all as read:", error);
    return { success: false, message: "An error occurred." };
  }
}

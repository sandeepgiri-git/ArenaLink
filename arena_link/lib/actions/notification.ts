"use server";

import connectDB from "@/lib/db";
import Notification from "@/models/Notification";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export type NotificationDisplayData = {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedMatchId?: string;
  relatedUserId?: string;
};

export async function getUserNotifications(): Promise<NotificationDisplayData[]> {
  try {
    const session = await auth();
    if (!session?.user?.id) return [];

    await connectDB();

    const notifications = await Notification.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()
      .exec();

    return notifications.map((n: any) => ({
      id: n._id.toString(),
      type: n.type,
      message: n.message,
      isRead: n.isRead,
      createdAt: n.createdAt.toISOString(),
      relatedMatchId: n.relatedMatchId?.toString(),
      relatedUserId: n.relatedUserId?.toString(),
    }));
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return [];
  }
}

export async function getUnreadNotificationCount(): Promise<number> {
  try {
    const session = await auth();
    if (!session?.user?.id) return 0;

    await connectDB();

    return await Notification.countDocuments({ userId: session.user.id, isRead: false });
  } catch (error) {
    console.error("Failed to get unread notification count:", error);
    return 0;
  }
}

export async function markNotificationAsRead(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false };

    await connectDB();

    await Notification.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: { isRead: true } }
    );

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    return { success: false };
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false };

    await connectDB();

    await Notification.updateMany(
      { userId: session.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
    return { success: false };
  }
}

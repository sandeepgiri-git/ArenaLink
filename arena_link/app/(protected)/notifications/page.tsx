"use client";

import { useEffect, useState } from "react";
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead, type NotificationDisplayData } from "@/lib/actions/notification";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationDisplayData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchNotifs = async () => {
      const data = await getUserNotifications();
      setNotifications(data);
      setIsLoading(false);
    };
    fetchNotifs();
  }, []);

  const handleNotificationClick = async (notif: NotificationDisplayData) => {
    if (!notif.isRead) {
      await markNotificationAsRead(notif.id);
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
    }
    
    if (notif.relatedMatchId) {
      router.push(`/matches/${notif.relatedMatchId}`);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "join_request":
        return "👋";
      case "request_accepted":
        return "✅";
      case "request_rejected":
        return "❌";
      case "match_cancelled":
        return "⚠️";
      case "match_completed":
        return "🏆";
      default:
        return "🔔";
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Notifications</h1>
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllRead}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="glass-card overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-muted">
            <div className="w-16 h-16 rounded-full bg-surface-hover flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">You're all caught up!</h3>
            <p>No new notifications to show right now.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                onClick={() => handleNotificationClick(notif)}
                className={`p-5 flex gap-4 cursor-pointer transition-colors ${
                  notif.isRead ? "hover:bg-surface-hover" : "bg-primary/5 hover:bg-primary/10"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-xl flex-shrink-0">
                  {getIconForType(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <p className={`text-sm md:text-base ${notif.isRead ? "text-foreground" : "font-semibold text-foreground"}`}>
                      {notif.message}
                    </p>
                    {!notif.isRead && (
                      <span className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0 mt-1.5 ml-3"></span>
                    )}
                  </div>
                  <p className="text-xs text-muted">
                    {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

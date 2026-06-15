"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getUnreadNotificationCount } from "@/lib/actions/notification";

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const count = await getUnreadNotificationCount();
      setUnreadCount(count);
    };

    fetchCount();

    // Poll every 10 seconds for new notifications
    const interval = setInterval(fetchCount, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link href="/notifications" className="relative p-2 rounded-full hover:bg-surface-hover transition-colors text-muted-foreground hover:text-foreground">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
      {unreadCount > 0 && (
        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-danger rounded-full border-2 border-background animate-pulse"></span>
      )}
    </Link>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

interface UseNotificationsReturn {
  unreadCount: number;
  loading: boolean;
  refreshUnreadCount: () => Promise<void>;
  markAsRead: () => void;
}

export function useNotifications(): UseNotificationsReturn {
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refreshUnreadCount = useCallback(async () => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/messages/unread-count");
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.user]);

  const markAsRead = useCallback(() => {
    setUnreadCount(0);
  }, []);

  useEffect(() => {
    refreshUnreadCount();
  }, [refreshUnreadCount]);

  return {
    unreadCount,
    loading,
    refreshUnreadCount,
    markAsRead,
  };
}

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  BellIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { useNotifications } from "@/hooks/useNotifications";

interface NotificationBannerProps {
  className?: string;
}

export default function NotificationBanner({
  className = "",
}: NotificationBannerProps) {
  const { data: session } = useSession();
  const { unreadCount, loading } = useNotifications();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!loading && unreadCount > 0) {
      setIsVisible(true);
    }
  }, [unreadCount, loading]);

  // Don't render if no unread messages or loading
  if (loading || !isVisible || unreadCount === 0 || !session) {
    return null;
  }

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <div className={`bg-green-50 border-l-4 border-green-400 p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <BellIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-green-700">
            <span className="font-medium">
              You have {unreadCount} unread message{unreadCount > 1 ? "s" : ""}!
            </span>{" "}
            Check your messages to stay connected with the community.
          </p>
          <div className="mt-2">
            <div className="-mx-2 -my-1.5 flex">
              <Link
                href="/messages"
                className="rounded-md bg-green-50 px-2 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50 flex items-center"
              >
                <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                View Messages
              </Link>
              <button
                type="button"
                className="ml-3 rounded-md bg-green-50 px-2 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                onClick={handleDismiss}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
              onClick={handleDismiss}
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

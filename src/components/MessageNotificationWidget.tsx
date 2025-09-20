"use client";

import Link from "next/link";
import { ChatBubbleLeftRightIcon, BellIcon } from "@heroicons/react/24/outline";
import { useNotifications } from "@/hooks/useNotifications";

interface MessageNotificationWidgetProps {
  className?: string;
}

export default function MessageNotificationWidget({
  className = "",
}: MessageNotificationWidgetProps) {
  const { unreadCount, loading } = useNotifications();

  if (loading || unreadCount === 0) {
    return null;
  }

  return (
    <Link
      href="/messages"
      className={`bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 block ${className}`}
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <div className="relative">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-green-600" />
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </div>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">New Messages</p>
          <p className="text-xs text-gray-600">
            You have {unreadCount} unread message{unreadCount > 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex-shrink-0">
          <BellIcon className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </Link>
  );
}

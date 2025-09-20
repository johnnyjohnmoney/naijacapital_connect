"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  XMarkIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

interface MessageComposerProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId?: string;
  recipientName?: string;
  recipientRole?: string;
  onSuccess?: () => void;
  isReply?: boolean; // New prop to indicate if this is a reply to existing conversation
  replySubject?: string; // Original subject to reply to
}

interface MessageData {
  receiverId: string;
  subject: string;
  content: string;
}

export default function MessageComposer({
  isOpen,
  onClose,
  recipientId = "",
  recipientName = "",
  recipientRole = "",
  onSuccess,
  isReply = false,
  replySubject = "",
}: MessageComposerProps) {
  const { data: session } = useSession();

  // Auto-generate subject for replies
  const defaultSubject =
    isReply && replySubject
      ? replySubject.startsWith("Re: ")
        ? replySubject
        : `Re: ${replySubject}`
      : "";

  const [messageData, setMessageData] = useState<MessageData>({
    receiverId: recipientId,
    subject: defaultSubject,
    content: "",
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // User search states (only used when no recipientId provided)
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { id: string; name: string; email: string; role: string }[]
  >([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
  } | null>(null);

  // Search for users (only when no recipient specified)
  const searchUsers = async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const response = await fetch(
        `/api/users/search?q=${encodeURIComponent(query)}&limit=10`
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.users || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  // Handle search input change with debounce
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setSelectedUser(null);
    setMessageData({ ...messageData, receiverId: "" });

    // Debounce search
    const timeoutId = setTimeout(() => {
      searchUsers(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  // Select a user from search results
  const selectUser = (user: {
    id: string;
    name: string;
    email: string;
    role: string;
  }) => {
    setSelectedUser(user);
    setMessageData({ ...messageData, receiverId: user.id });
    setSearchQuery(user.name);
    setSearchResults([]);
  };

  // Clear selected user
  const clearSelection = () => {
    setSelectedUser(null);
    setSearchQuery("");
    setSearchResults([]);
    setMessageData({ ...messageData, receiverId: "" });
  };

  const handleSend = async () => {
    if (!messageData.receiverId || !messageData.content.trim()) {
      setError("Please fill in recipient and message content");
      return;
    }

    // For new conversations (not replies), subject is required
    if (!isReply && !messageData.subject.trim()) {
      setError("Please enter a subject for new conversations");
      return;
    }

    try {
      setSending(true);
      setError(null);

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...messageData,
          subject: messageData.subject || "Message", // Fallback subject for replies
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      // Reset form and close modal
      setMessageData({
        receiverId: recipientId,
        subject: defaultSubject,
        content: "",
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setMessageData({
      receiverId: recipientId,
      subject: defaultSubject,
      content: "",
    });
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Send Message</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4 max-h-96 overflow-y-auto">
          {/* Recipient Info */}
          {recipientName && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {recipientName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {recipientRole.replace("_", " ")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recipient ID Field (if no recipient specified) */}
          {!recipientId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Send to
              </label>
              {selectedUser ? (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center space-x-3">
                    <UserCircleIcon className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedUser.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedUser.email} •{" "}
                        {selectedUser.role.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={clearSelection}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  {searching && (
                    <div className="absolute right-2 top-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                    </div>
                  )}
                  {searchResults.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-48 overflow-y-auto">
                      {searchResults.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => selectUser(user)}
                          className="w-full p-3 text-left hover:bg-gray-50 flex items-center space-x-3 border-b border-gray-100 last:border-b-0"
                        >
                          <UserCircleIcon className="h-8 w-8 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user.email} • {user.role.replace("_", " ")}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchQuery.length >= 2 &&
                    searchResults.length === 0 &&
                    !searching && (
                      <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg p-3">
                        <p className="text-sm text-gray-500 text-center">
                          No users found matching "{searchQuery}"
                        </p>
                      </div>
                    )}
                </div>
              )}
            </div>
          )}

          {/* Subject Field - Hidden for replies */}
          {!isReply && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                placeholder="Enter message subject"
                value={messageData.subject}
                onChange={(e) =>
                  setMessageData({ ...messageData, subject: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          )}

          {/* Message Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              placeholder="Type your message here..."
              value={messageData.content}
              onChange={(e) =>
                setMessageData({ ...messageData, content: e.target.value })
              }
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={handleClose}
            disabled={sending}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={
              sending ||
              !messageData.receiverId ||
              (!isReply && !messageData.subject.trim()) ||
              !messageData.content.trim()
            }
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <PaperAirplaneIcon className="h-4 w-4" />
            <span>{sending ? "Sending..." : "Send Message"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

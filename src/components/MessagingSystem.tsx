"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  ClockIcon,
  XMarkIcon,
  PlusIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Message {
  id: string;
  content: string;
  subject: string;
  status: "UNREAD" | "READ";
  createdAt: string;
  sender: User;
  receiver: User;
}

interface Conversation {
  user: User;
  latestMessage: Message | null;
  unreadCount: number;
}

interface MessagingSystemProps {
  initialUserId?: string; // If provided, opens conversation with this user
  compact?: boolean; // For dashboard integration
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

export default function MessagingSystem({
  initialUserId,
  compact = false,
}: MessagingSystemProps) {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(
    initialUserId || null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewMessage, setShowNewMessage] = useState(false);

  // Form states
  const [newMessage, setNewMessage] = useState({
    receiverId: "",
    subject: "",
    content: "",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch conversations list
  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/messages/conversations");
      if (!response.ok) throw new Error("Failed to fetch conversations");

      const data = await response.json();
      setConversations(data.conversations);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch conversations"
      );
    }
  };

  // Fetch messages for a specific conversation
  const fetchMessages = async (userId: string) => {
    try {
      const response = await fetch(`/api/messages/conversations/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch messages");

      const data = await response.json();
      setMessages(data.messages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch messages");
    }
  };

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.content.trim() || !newMessage.subject.trim()) {
      alert("Please fill in both subject and message content");
      return;
    }

    try {
      setSendingMessage(true);
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      // Reset form
      setNewMessage({ receiverId: "", subject: "", content: "" });
      setShowNewMessage(false);

      // Refresh conversations and current conversation if applicable
      await fetchConversations();
      if (currentConversation === newMessage.receiverId) {
        await fetchMessages(newMessage.receiverId);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  // Reply to current conversation
  const replyToConversation = async (content: string, subject?: string) => {
    if (!currentConversation || !content.trim()) return;

    // If no subject provided, use the latest message's subject with "Re: " prefix
    let messageSubject = subject;
    if (!messageSubject && messages.length > 0) {
      const latestSubject = messages[messages.length - 1].subject;
      messageSubject = latestSubject.startsWith("Re: ")
        ? latestSubject
        : `Re: ${latestSubject}`;
    }

    try {
      setSendingMessage(true);
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId: currentConversation,
          subject: messageSubject || "Reply",
          content,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send message");
      }

      // Refresh the current conversation
      await fetchMessages(currentConversation);
      await fetchConversations();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchConversations().finally(() => setLoading(false));
      if (initialUserId) {
        fetchMessages(initialUserId);
      }
    }
  }, [session, initialUserId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        compact ? "h-96" : "h-[600px]"
      } bg-white rounded-lg shadow border flex`}
    >
      {/* Conversations Sidebar */}
      <div
        className={`${
          compact ? "w-1/3" : "w-1/4"
        } border-r border-gray-200 flex flex-col`}
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Messages</h3>
          <button
            onClick={() => setShowNewMessage(true)}
            className="p-1 text-green-600 hover:text-green-700"
            title="New Message"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center">
              <ChatBubbleLeftRightIcon className="mx-auto h-8 w-8 text-gray-400" />
              <p className="text-sm text-gray-500 mt-2">No conversations yet</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.user.id}
                onClick={() => {
                  setCurrentConversation(conversation.user.id);
                  fetchMessages(conversation.user.id);
                }}
                className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  currentConversation === conversation.user.id
                    ? "bg-green-50"
                    : ""
                }`}
              >
                <div className="flex items-start space-x-3">
                  <UserCircleIcon className="h-8 w-8 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {conversation.user.name}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-1">
                      {conversation.user.role.replace("_", " ")}
                    </p>
                    {conversation.latestMessage && (
                      <>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.latestMessage.subject}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center mt-1">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          {formatTimeAgo(conversation.latestMessage.createdAt)}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <ConversationView
            userId={currentConversation}
            messages={messages}
            onSendMessage={replyToConversation}
            sendingMessage={sendingMessage}
            compact={compact}
            isExistingConversation={messages.length > 0}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Select a conversation
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Choose a conversation from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>

      {/* New Message Modal */}
      {showNewMessage && (
        <NewMessageModal
          onClose={() => setShowNewMessage(false)}
          onSend={sendMessage}
          messageData={newMessage}
          setMessageData={setNewMessage}
          sending={sendingMessage}
        />
      )}
    </div>
  );
}

// Conversation view component
function ConversationView({
  userId,
  messages,
  onSendMessage,
  sendingMessage,
  compact,
  isExistingConversation,
}: {
  userId: string;
  messages: Message[];
  onSendMessage: (content: string, subject?: string) => Promise<void>;
  sendingMessage: boolean;
  compact: boolean;
  isExistingConversation: boolean;
}) {
  const { data: session } = useSession();
  const [replyContent, setReplyContent] = useState("");
  const [replySubject, setReplySubject] = useState("");

  const otherUser =
    messages.length > 0
      ? messages[0].sender.id === session?.user?.id
        ? messages[0].receiver
        : messages[0].sender
      : null;

  const handleSendReply = async () => {
    if (!replyContent.trim()) {
      alert("Please enter a message");
      return;
    }

    // For existing conversations, don't require subject
    if (!isExistingConversation && !replySubject.trim()) {
      alert("Please enter a subject for new conversations");
      return;
    }

    await onSendMessage(
      replyContent,
      isExistingConversation ? undefined : replySubject
    );
    setReplyContent("");
    setReplySubject("");
  };

  return (
    <>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <UserCircleIcon className="h-8 w-8 text-gray-400" />
          <div>
            <h4 className="text-lg font-medium text-gray-900">
              {otherUser?.name || "Unknown User"}
            </h4>
            <p className="text-sm text-gray-500">
              {otherUser?.role.replace("_", " ")}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwn = message.sender.id === session?.user?.id;

          return (
            <div
              key={message.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  isOwn
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm font-medium mb-1">{message.subject}</p>
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    isOwn ? "text-green-100" : "text-gray-500"
                  }`}
                >
                  {formatTimeAgo(message.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={useRef<HTMLDivElement>(null)} />
      </div>

      {/* Reply Form */}
      <div className="border-t border-gray-200 p-4">
        <div className="space-y-3">
          {/* Show subject field only for new conversations */}
          {!isExistingConversation && (
            <input
              type="text"
              placeholder="Subject..."
              value={replySubject}
              onChange={(e) => setReplySubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          )}
          <div className="flex space-x-2">
            <textarea
              placeholder="Type your message..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={compact ? 2 : 3}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
            <button
              onClick={handleSendReply}
              disabled={
                sendingMessage ||
                !replyContent.trim() ||
                (!isExistingConversation && !replySubject.trim())
              }
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// New message modal component
function NewMessageModal({
  onClose,
  onSend,
  messageData,
  setMessageData,
  sending,
}: {
  onClose: () => void;
  onSend: () => Promise<void>;
  messageData: { receiverId: string; subject: string; content: string };
  setMessageData: (data: {
    receiverId: string;
    subject: string;
    content: string;
  }) => void;
  sending: boolean;
}) {
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

  // Search for users
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">New Message</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
          {/* User Search/Selection */}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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

          {/* Subject Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              placeholder="Message subject"
              value={messageData.subject}
              onChange={(e) =>
                setMessageData({ ...messageData, subject: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Message Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              placeholder="Type your message..."
              value={messageData.content}
              onChange={(e) =>
                setMessageData({ ...messageData, content: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onSend}
            disabled={
              sending ||
              !messageData.receiverId ||
              !messageData.subject.trim() ||
              !messageData.content.trim()
            }
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

// src/app/messages/page.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import ProfileDropdown from '@/components/ProfileDropdown';
import {
  Home,
  ShoppingBag,
  Bell,
  Search,
  Send,
  Image as ImageIcon,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  Smile,
  Loader2,
  MessageCircle,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface User {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email?: string;
}

interface Conversation {
  conversation_id: string;
  participant: User;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  attachments: string[] | null;
}

// ─── Helper Components ────────────────────────────────────────────────────────

function Avatar({
  url,
  name,
  size = 'md',
}: {
  url: string | null;
  name: string | null;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizes = {
    sm: 'h-10 w-10 text-sm',
    md: 'h-12 w-12 text-base',
    lg: 'h-16 w-16 text-xl',
  };

  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={name || 'User'}
        className={`${sizes[size]} rounded-full object-cover`}
      />
    );
  }

  const initials =
    name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '??';
  return (
    <div
      className={`${sizes[size]} flex items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-500 font-bold text-white`}
    >
      {initials}
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // ✅ Load current user and conversations
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, email')
          .eq('id', user.id)
          .single();

        if (profile) setCurrentUser(profile);

        await loadConversations(user.id);

        // Check if there's a user parameter to start a conversation with
        const userParam = searchParams.get('user');
        if (userParam && profile) {
          // Check if conversation already exists
          const existingConv = conversations.find(
            (c) => c.participant.id === userParam
          );
          if (existingConv) {
            setSelectedConversationId(existingConv.conversation_id);
          } else {
            // Start new conversation
            setSelectedConversationId(`${profile.id}_${userParam}`);
          }
        }
      } catch (err) {
        console.error('Init error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [router, searchParams]);

  // ✅ Load conversations from database
  const loadConversations = async (userId: string) => {
    try {
      // Get all messages where user is sender or receiver
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select(
          `
          *,
          sender:sender_id(id, full_name, avatar_url),
          receiver:receiver_id(id, full_name, avatar_url)
        `
        )
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by conversation
      const convMap = new Map<string, Conversation>();

      messagesData?.forEach((msg: any) => {
        const otherUser = msg.sender_id === userId ? msg.receiver : msg.sender;
        const conversationId =
          msg.sender_id === userId
            ? `${msg.sender_id}_${msg.receiver_id}`
            : `${msg.receiver_id}_${msg.sender_id}`;

        if (!convMap.has(conversationId)) {
          convMap.set(conversationId, {
            conversation_id: conversationId,
            participant: otherUser,
            last_message: msg.content,
            last_message_time: msg.created_at,
            unread_count: 0,
          });
        }

        // Count unread messages
        if (!msg.is_read && msg.receiver_id === userId) {
          const conv = convMap.get(conversationId)!;
          conv.unread_count++;
        }
      });

      setConversations(Array.from(convMap.values()));
    } catch (err) {
      console.error('Load conversations error:', err);
    }
  };

  // ✅ Load messages for selected conversation
  useEffect(() => {
    if (selectedConversationId && currentUser) {
      loadMessages(selectedConversationId, currentUser.id);
    }
  }, [selectedConversationId, currentUser, loadMessages]);

  const loadMessages = async (conversationId: string, userId: string) => {
    try {
      const [user1, user2] = conversationId.split('_');

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(
          `and(sender_id.eq.${user1},receiver_id.eq.${user2}),and(sender_id.eq.${user2},receiver_id.eq.${user1})`
        )
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);

      // Mark messages as read
      const unreadIds = data
        ?.filter((m) => !m.is_read && m.receiver_id === userId)
        .map((m) => m.id);

      if (unreadIds && unreadIds.length > 0) {
        await supabase
          .from('messages')
          .update({ is_read: true, read_at: new Date().toISOString() })
          .in('id', unreadIds);

        // Reload conversations to update unread counts
        await loadConversations(userId);
      }

      scrollToBottom();
    } catch (err) {
      console.error('Load messages error:', err);
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ✅ Send message to database
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversationId || !currentUser) return;

    setIsSending(true);

    try {
      const [user1, user2] = selectedConversationId.split('_');
      const receiverId = user1 === currentUser.id ? user2 : user1;

      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversationId,
          sender_id: currentUser.id,
          receiver_id: receiverId,
          content: newMessage.trim(),
        })
        .select()
        .single();

      if (error) throw error;

      // Add message to UI
      setMessages([...messages, data]);
      setNewMessage('');

      // Reload conversations to update last message
      await loadConversations(currentUser.id);
    } catch (err) {
      console.error('Send message error:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectedConv = conversations.find(
    (c) => c.conversation_id === selectedConversationId
  );

  const filteredConversations = conversations.filter((conv) =>
    conv.participant.full_name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      {/* Top Navigation */}
      <nav className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-lg bg-linear-to-br from-blue-600 to-purple-600"></div>
              <span className="hidden text-xl font-bold text-gray-900 sm:block">
                Gigrise
              </span>
            </Link>

            <div className="flex items-center space-x-2">
              <Link
                href="/feed"
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
              >
                <Home className="h-6 w-6" />
              </Link>
              <Link
                href="/marketplace"
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
              >
                <ShoppingBag className="h-6 w-6" />
              </Link>
              <Link
                href="/messages"
                className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
              >
                <MessageCircle className="h-6 w-6" />
              </Link>
              <Link
                href="/notifications"
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
              >
                <Bell className="h-6 w-6" />
              </Link>
              {currentUser && (
                <ProfileDropdown
                  avatarUrl={currentUser.avatar_url}
                  fullName={currentUser.full_name}
                  email={currentUser.email || null}
                />
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Chat Interface */}
      <div className="flex flex-1 overflow-hidden">
        {/* Conversations Sidebar */}
        <div className="w-full border-r bg-white md:w-80 lg:w-96">
          {/* Search */}
          <div className="border-b p-4">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pr-4 pl-10 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div
            className="overflow-y-auto"
            style={{ height: 'calc(100vh - 140px)' }}
          >
            {filteredConversations.length === 0 ? (
              <div className="py-12 text-center">
                <MessageCircle className="mx-auto h-12 w-12 text-gray-300" />
                <p className="mt-2 text-gray-500">No conversations yet</p>
                <Link
                  href="/feed"
                  className="mt-4 inline-block text-sm text-blue-600 hover:underline"
                >
                  Browse gigs to start chatting
                </Link>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <button
                  key={conv.conversation_id}
                  onClick={() =>
                    setSelectedConversationId(conv.conversation_id)
                  }
                  className={`flex w-full items-start space-x-3 border-b p-4 text-left transition hover:bg-gray-50 ${
                    selectedConversationId === conv.conversation_id
                      ? 'bg-blue-50'
                      : ''
                  }`}
                >
                  <Avatar
                    url={conv.participant.avatar_url}
                    name={conv.participant.full_name}
                    size="md"
                  />
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">
                        {conv.participant.full_name || 'Unknown User'}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {timeAgo(conv.last_message_time)}
                      </span>
                    </div>
                    <p className="truncate text-sm text-gray-600">
                      {conv.last_message}
                    </p>
                    {conv.unread_count > 0 && (
                      <div className="mt-1">
                        <span className="inline-flex items-center justify-center rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
                          {conv.unread_count}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        {!selectedConversationId ? (
          <div className="hidden flex-1 items-center justify-center bg-gray-50 md:flex">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200">
                <Send className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Select a conversation
              </h3>
              <p className="text-sm text-gray-600">
                Choose from your existing conversations
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col bg-gray-50">
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b bg-white px-6 py-4">
              <div className="flex items-center space-x-3">
                <Avatar
                  url={selectedConv?.participant.avatar_url || null}
                  name={selectedConv?.participant.full_name || null}
                  size="md"
                />
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {selectedConv?.participant.full_name || 'Unknown User'}
                  </h2>
                  <p className="text-sm text-gray-600">Active</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                  <Phone className="h-5 w-5" />
                </button>
                <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                  <Video className="h-5 w-5" />
                </button>
                <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-6"
              style={{ height: 'calc(100vh - 220px)' }}
            >
              {messages.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-500">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-4 flex ${msg.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md rounded-2xl px-4 py-2 ${
                        msg.sender_id === currentUser?.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={`mt-1 text-xs ${
                          msg.sender_id === currentUser?.id
                            ? 'text-blue-100'
                            : 'text-gray-500'
                        }`}
                      >
                        {timeAgo(msg.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t bg-white p-4">
              <div className="flex items-end space-x-2">
                <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                  <Paperclip className="h-5 w-5" />
                </button>
                <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                  <ImageIcon className="h-5 w-5" />
                </button>
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                  <Smile className="h-5 w-5" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isSending}
                  className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

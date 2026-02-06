// src/app/messages/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Home,
  Search,
  Bell,
  Settings,
  Phone,
  Video,
  Info,
  MoreVertical,
  Send,
  Smile,
  Image as ImageIcon,
  Paperclip,
  Mic,
  Circle,
  ShoppingBag,
} from 'lucide-react';

// Mock conversations
const CONVERSATIONS = [
  {
    id: '1',
    user: {
      name: 'Sarah Banda',
      avatar: '👩‍🎨',
      online: true,
    },
    lastMessage: 'The logo design looks perfect! Thanks!',
    timestamp: '2m ago',
    unread: 2,
  },
  {
    id: '2',
    user: {
      name: 'Mike Chirwa',
      avatar: '👨‍💼',
      online: true,
    },
    lastMessage: 'When can you start the project?',
    timestamp: '15m ago',
    unread: 1,
  },
  {
    id: '3',
    user: {
      name: 'Grace Mwale',
      avatar: '✍️',
      online: false,
    },
    lastMessage: 'Thanks for the quick delivery!',
    timestamp: '1h ago',
    unread: 0,
  },
  {
    id: '4',
    user: {
      name: 'David Kachamba',
      avatar: '🎬',
      online: false,
    },
    lastMessage: 'Can you send me some samples?',
    timestamp: '3h ago',
    unread: 0,
  },
  {
    id: '5',
    user: {
      name: 'Alice Tembo',
      avatar: '👩‍💻',
      online: true,
    },
    lastMessage: "Perfect! Let's get started.",
    timestamp: '1d ago',
    unread: 0,
  },
];

// Mock messages for selected conversation
const MOCK_MESSAGES = [
  {
    id: '1',
    senderId: '1',
    text: 'Hi! I saw your web development gig. Are you available for a project?',
    timestamp: '10:30 AM',
    isMe: false,
  },
  {
    id: '2',
    senderId: 'me',
    text: "Hello! Yes, I'm available. What kind of project do you have in mind?",
    timestamp: '10:32 AM',
    isMe: true,
  },
  {
    id: '3',
    senderId: '1',
    text: 'I need an e-commerce website with payment integration. Can you handle that?',
    timestamp: '10:33 AM',
    isMe: false,
  },
  {
    id: '4',
    senderId: 'me',
    text: "Absolutely! I've built several e-commerce sites. Let me show you my portfolio.",
    timestamp: '10:35 AM',
    isMe: true,
  },
  {
    id: '5',
    senderId: 'me',
    text: 'Here are some examples: 🛒',
    timestamp: '10:35 AM',
    isMe: true,
  },
  {
    id: '6',
    senderId: '1',
    text: 'The logo design looks perfect! Thanks!',
    timestamp: '10:40 AM',
    isMe: false,
  },
];

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(CONVERSATIONS[0]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    // Here you would send the message to your backend
    console.log('Sending message:', messageText);
    setMessageText('');
  };

  const filteredConversations = CONVERSATIONS.filter((conv) =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-white">
      {/* Conversations Sidebar */}
      <div className="flex w-full flex-col border-r md:w-96">
        {/* Header */}
        <div className="border-b p-4">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <div className="flex items-center space-x-2">
              <Link
                href="/feed"
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
              >
                <Home className="h-5 w-5" />
              </Link>
              <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full bg-gray-100 py-2 pr-4 pl-10 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setSelectedChat(conversation)}
              className={`flex w-full items-center space-x-3 p-4 transition hover:bg-gray-50 ${
                selectedChat.id === conversation.id ? 'bg-blue-50' : ''
              }`}
            >
              {/* Avatar with online status */}
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 text-2xl">
                  {conversation.user.avatar}
                </div>
                {conversation.user.online && (
                  <Circle className="absolute right-0 bottom-0 h-4 w-4 fill-green-500 text-white" />
                )}
              </div>

              {/* Message Preview */}
              <div className="flex-1 overflow-hidden text-left">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">
                    {conversation.user.name}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {conversation.timestamp}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p
                    className={`truncate text-sm ${
                      conversation.unread > 0
                        ? 'font-semibold text-gray-900'
                        : 'text-gray-600'
                    }`}
                  >
                    {conversation.lastMessage}
                  </p>
                  {conversation.unread > 0 && (
                    <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                      {conversation.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="hidden flex-1 flex-col md:flex">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xl">
                {selectedChat.user.avatar}
              </div>
              {selectedChat.user.online && (
                <Circle className="absolute right-0 bottom-0 h-3 w-3 fill-green-500 text-white" />
              )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
                {selectedChat.user.name}
              </h2>
              <p className="text-xs text-gray-600">
                {selectedChat.user.online ? 'Active now' : 'Offline'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="rounded-lg p-2 text-blue-600 hover:bg-blue-50">
              <Phone className="h-5 w-5" />
            </button>
            <button className="rounded-lg p-2 text-blue-600 hover:bg-blue-50">
              <Video className="h-5 w-5" />
            </button>
            <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
              <Info className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {MOCK_MESSAGES.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs rounded-2xl px-4 py-2 ${
                  message.isMe
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className={`mt-1 text-xs ${
                    message.isMe ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="border-t p-4">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="rounded-full p-2 text-blue-600 hover:bg-blue-50"
            >
              <ImageIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="rounded-full p-2 text-blue-600 hover:bg-blue-50"
            >
              <Paperclip className="h-5 w-5" />
            </button>

            <div className="relative flex-1">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
                className="w-full rounded-full bg-gray-100 py-2 pr-12 pl-4 text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 hover:text-gray-900"
              >
                <Smile className="h-5 w-5" />
              </button>
            </div>

            {messageText.trim() ? (
              <button
                type="submit"
                className="rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700"
              >
                <Send className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="button"
                className="rounded-full p-2 text-blue-600 hover:bg-blue-50"
              >
                <Mic className="h-5 w-5" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Mobile: Show chat when selected */}
      <div className="flex flex-1 flex-col md:hidden">
        <div className="flex flex-1 items-center justify-center p-8 text-center">
          <div>
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-4xl">
              💬
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Your Messages
            </h3>
            <p className="text-gray-600">
              Select a conversation to start messaging
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

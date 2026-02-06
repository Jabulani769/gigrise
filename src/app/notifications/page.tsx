// src/app/notifications/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Home,
  ShoppingBag,
  MessageCircle,
  Settings,
  Heart,
  MessageSquare,
  UserPlus,
  Star,
  Package,
  TrendingUp,
  Award,
  DollarSign,
  CheckCircle,
  X,
} from 'lucide-react';

// Mock notifications
const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'like',
    user: {
      name: 'Sarah Banda',
      avatar: '👩‍🎨',
    },
    action: 'liked your post',
    content: '"Professional Logo Design Services"',
    time: '5 minutes ago',
    read: false,
    icon: Heart,
    iconColor: 'text-red-500',
  },
  {
    id: '2',
    type: 'order',
    user: {
      name: 'Mike Chirwa',
      avatar: '👨‍💼',
    },
    action: 'placed an order',
    content: 'Website Development - MK 150,000',
    time: '1 hour ago',
    read: false,
    icon: Package,
    iconColor: 'text-blue-500',
  },
  {
    id: '3',
    type: 'comment',
    user: {
      name: 'Grace Mwale',
      avatar: '✍️',
    },
    action: 'commented on your post',
    content: '"This looks amazing! Can you do something similar for me?"',
    time: '2 hours ago',
    read: false,
    icon: MessageSquare,
    iconColor: 'text-green-500',
  },
  {
    id: '4',
    type: 'follow',
    user: {
      name: 'David Kachamba',
      avatar: '🎬',
    },
    action: 'started following you',
    content: null,
    time: '3 hours ago',
    read: true,
    icon: UserPlus,
    iconColor: 'text-purple-500',
  },
  {
    id: '5',
    type: 'review',
    user: {
      name: 'Alice Tembo',
      avatar: '👩‍💻',
    },
    action: 'left a 5-star review',
    content: '"Excellent work! Highly recommended."',
    time: '5 hours ago',
    read: true,
    icon: Star,
    iconColor: 'text-yellow-500',
  },
  {
    id: '6',
    type: 'milestone',
    user: null,
    action: 'Achievement Unlocked',
    content: "You've completed 50 orders! Keep up the great work! 🎉",
    time: '1 day ago',
    read: true,
    icon: Award,
    iconColor: 'text-orange-500',
  },
  {
    id: '7',
    type: 'payment',
    user: null,
    action: 'Payment received',
    content: 'MK 45,000 from Logo Design project',
    time: '1 day ago',
    read: true,
    icon: DollarSign,
    iconColor: 'text-green-600',
  },
  {
    id: '8',
    type: 'trending',
    user: null,
    action: 'Your gig is trending',
    content: '"Professional Logo Design" is now in top 10 trending gigs!',
    time: '2 days ago',
    read: true,
    icon: TrendingUp,
    iconColor: 'text-pink-500',
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const filteredNotifications =
    filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-lg bg-linear-to-br from-blue-600 to-purple-600"></div>
              <span className="text-xl font-bold text-gray-900">Gigrise</span>
            </Link>

            <div className="flex items-center space-x-2 sm:space-x-4">
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
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
              >
                <MessageCircle className="h-6 w-6" />
              </Link>
              <Link
                href="/settings"
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
              >
                <Settings className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-4 pt-20 pb-8">
        {/* Header */}
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Notifications
              </h1>
              <p className="text-gray-600">
                {unreadCount > 0 ? (
                  <>
                    You have {unreadCount} unread notification
                    {unreadCount !== 1 ? 's' : ''}
                  </>
                ) : (
                  "You're all caught up!"
                )}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="rounded-lg px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                filter === 'unread'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {filteredNotifications.length === 0 ? (
            <div className="rounded-lg bg-white p-12 text-center shadow-sm">
              <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                You're all caught up!
              </h3>
              <p className="text-gray-600">
                No new notifications at the moment.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`group flex items-start space-x-4 rounded-lg bg-white p-4 shadow-sm transition hover:shadow-md ${
                  !notification.read ? 'border-l-4 border-blue-600' : ''
                }`}
              >
                {/* Icon or Avatar */}
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                    notification.user ? 'bg-gray-100 text-2xl' : 'bg-blue-100'
                  }`}
                >
                  {notification.user ? (
                    notification.user.avatar
                  ) : (
                    <notification.icon
                      className={`h-6 w-6 ${notification.iconColor}`}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        {notification.user && (
                          <span className="font-semibold">
                            {notification.user.name}
                          </span>
                        )}{' '}
                        <span
                          className={notification.user ? '' : 'font-semibold'}
                        >
                          {notification.action}
                        </span>
                      </p>
                      {notification.content && (
                        <p className="mt-1 text-sm text-gray-600">
                          {notification.content}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        {notification.time}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 opacity-0 transition group-hover:opacity-100">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="rounded-lg p-1 text-blue-600 hover:bg-blue-50"
                          title="Mark as read"
                        >
                          <CheckCircle className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="rounded-lg p-1 text-gray-600 hover:bg-gray-100"
                        title="Delete"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons for specific notification types */}
                  {notification.type === 'order' && (
                    <div className="mt-3 flex space-x-2">
                      <Link
                        href={`/orders/${notification.id}`}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        View Order
                      </Link>
                      <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Decline
                      </button>
                    </div>
                  )}

                  {notification.type === 'follow' && (
                    <div className="mt-3">
                      <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        Follow Back
                      </button>
                    </div>
                  )}

                  {notification.type === 'comment' && (
                    <div className="mt-3">
                      <Link
                        href={`/feed/${notification.id}`}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Reply
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More */}
        {filteredNotifications.length > 0 && (
          <div className="mt-6 text-center">
            <button className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Load More Notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

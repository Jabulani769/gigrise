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
  Menu,
  Search,
  DollarSign,
  CheckCircle,
  MoreHorizontal,
  Check,
  Bell,
  Filter,
} from 'lucide-react';

// Mock notifications with realistic data
const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'like',
    user: {
      name: 'Sarah Banda',
      avatar: '👩‍🎨',
      verified: true,
    },
    action: 'and 12 others liked your post',
    content: '"Professional Logo Design Services - Starting at MK 25,000"',
    time: '5m',
    read: false,
    link: '/feed/post-123',
    image: '🎨',
  },
  {
    id: '2',
    type: 'order',
    user: {
      name: 'Mike Chirwa',
      avatar: '👨‍💼',
      verified: true,
    },
    action: 'placed an order',
    content: 'Website Development - MK 150,000',
    time: '1h',
    read: false,
    link: '/orders/456',
    image: '💻',
  },
  {
    id: '3',
    type: 'comment',
    user: {
      name: 'Grace Mwale',
      avatar: '✍️',
      verified: false,
    },
    action: 'commented on your post',
    content: '"This looks amazing! Can you do something similar for me?"',
    time: '2h',
    read: false,
    link: '/feed/post-123',
    image: null,
  },
  {
    id: '4',
    type: 'follow',
    user: {
      name: 'David Kachamba',
      avatar: '🎬',
      verified: false,
    },
    action: 'started following you',
    content: null,
    time: '3h',
    read: true,
    link: '/profile/david-kachamba',
    image: null,
  },
  {
    id: '5',
    type: 'review',
    user: {
      name: 'Alice Tembo',
      avatar: '👩‍💻',
      verified: true,
    },
    action: 'left you a 5-star review',
    content: '"Excellent work! Highly recommended. Will hire again."',
    time: '5h',
    read: true,
    link: '/reviews/789',
    image: null,
  },
  {
    id: '6',
    type: 'milestone',
    user: null,
    action: 'Achievement Unlocked! 🎉',
    content: "You've completed 50 orders. Keep up the great work!",
    time: '1d',
    read: true,
    link: '/achievements',
    image: '🏆',
  },
  {
    id: '7',
    type: 'payment',
    user: null,
    action: 'Payment received',
    content:
      'MK 45,000 from Logo Design project has been credited to your account',
    time: '1d',
    read: true,
    link: '/earnings',
    image: '💰',
  },
  {
    id: '8',
    type: 'trending',
    user: null,
    action: 'Your gig is trending',
    content:
      '"Professional Logo Design" is now in top 10 trending gigs in Graphic Design!',
    time: '2d',
    read: true,
    link: '/gigs/123',
    image: '📈',
  },
  {
    id: '9',
    type: 'mention',
    user: {
      name: 'John Banda',
      avatar: '👨',
      verified: false,
    },
    action: 'mentioned you in a comment',
    content: '"@JohnPhiri you should check this out!"',
    time: '3d',
    read: true,
    link: '/feed/post-456',
    image: null,
  },
];

type NotificationFilter = 'all' | 'unread' | 'mentions' | 'orders';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

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

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'mentions') return n.type === 'mention';
    if (filter === 'orders') return n.type === 'order';
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-5 w-5 fill-red-500 text-red-500" />;
      case 'comment':
        return <MessageSquare className="h-5 w-5 text-green-600" />;
      case 'follow':
        return <UserPlus className="h-5 w-5 text-blue-600" />;
      case 'review':
        return <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />;
      case 'order':
        return <Package className="h-5 w-5 text-blue-600" />;
      case 'payment':
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case 'trending':
        return <TrendingUp className="h-5 w-5 text-pink-600" />;
      case 'milestone':
        return <Award className="h-5 w-5 text-orange-600" />;
      case 'mention':
        return <MessageSquare className="h-5 w-5 text-purple-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string, read: boolean) => {
    if (read) return 'hover:bg-gray-50';
    return 'bg-blue-50 hover:bg-blue-100';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <div className="min-h-screen bg-gray-100"> */}
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-lg bg-linear-to-br from-blue-600 to-purple-600"></div>
              <span className="hidden text-xl font-bold text-gray-900 sm:block">
                Gigrise
              </span>
            </Link>

            {/* Search Bar */}
            <div className="hidden max-w-md flex-1 px-4 md:block">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-700" />
                <input
                  type="text"
                  placeholder="Search gigs, jobs, freelancers..."
                  className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pr-4 pl-10 text-gray-700 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Right Menu */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link
                href="/feed"
                className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
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

              <button className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                <Link href="/notifications">
                  <Bell className="h-6 w-6" />
                </Link>
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </button>

              <button className="flex items-center space-x-2 rounded-lg p-2 hover:bg-gray-100">
                <span className="text-2xl">👨‍💻</span>
                <Menu className="h-5 w-5 text-gray-600 sm:hidden" />
              </button>
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
              {unreadCount > 0 && (
                <p className="text-sm text-gray-600">
                  {unreadCount} unread notification
                  {unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {/* Filter Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter</span>
                </button>

                {showFilterMenu && (
                  <div className="absolute top-12 right-0 z-10 w-48 rounded-lg border bg-white shadow-lg">
                    <div className="py-2">
                      {[
                        { id: 'all', label: 'All notifications' },
                        { id: 'unread', label: 'Unread only' },
                        { id: 'mentions', label: 'Mentions' },
                        { id: 'orders', label: 'Orders' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setFilter(item.id as NotificationFilter);
                            setShowFilterMenu(false);
                          }}
                          className={`flex w-full items-center px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                            filter === item.id
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-700'
                          }`}
                        >
                          {filter === item.id && (
                            <Check className="mr-2 h-4 w-4" />
                          )}
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mark all as read */}
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs - Mobile Friendly */}
          <div className="flex gap-2 overflow-x-auto pb-2 sm:hidden">
            {[
              { id: 'all', label: 'All' },
              { id: 'unread', label: `Unread (${unreadCount})` },
              { id: 'mentions', label: 'Mentions' },
              { id: 'orders', label: 'Orders' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setFilter(item.id as NotificationFilter)}
                className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition ${
                  filter === item.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-1">
          {filteredNotifications.length === 0 ? (
            <div className="rounded-lg bg-white p-12 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Bell className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                No notifications
              </h3>
              <p className="text-gray-600">
                {filter === 'unread'
                  ? "You're all caught up!"
                  : 'When you get notifications, they will show up here'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <Link
                key={notification.id}
                href={notification.link}
                onClick={() =>
                  !notification.read && markAsRead(notification.id)
                }
                className={`group relative flex items-start gap-3 rounded-lg bg-white p-4 transition ${getNotificationColor(
                  notification.type,
                  notification.read
                )}`}
              >
                {/* Unread Indicator */}
                {!notification.read && (
                  <div className="absolute top-1/2 left-0 h-2 w-2 -translate-y-1/2 rounded-full bg-blue-600"></div>
                )}

                {/* Avatar or Icon */}
                <div className="relative shrink-0 pl-3">
                  {notification.user ? (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-2xl">
                      {notification.user.avatar}
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      {notification.image && (
                        <span className="text-2xl">{notification.image}</span>
                      )}
                    </div>
                  )}
                  {/* Icon Badge */}
                  <div className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md">
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden pt-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        {notification.user && (
                          <span className="font-semibold">
                            {notification.user.name}
                            {notification.user.verified && (
                              <span className="ml-1 text-blue-500">✓</span>
                            )}
                          </span>
                        )}{' '}
                        <span
                          className={notification.user ? '' : 'font-semibold'}
                        >
                          {notification.action}
                        </span>
                      </p>
                      {notification.content && (
                        <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                          {notification.content}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        {notification.time}
                      </p>
                    </div>

                    {/* Image Preview */}
                    {notification.image && notification.user && (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-blue-50 to-purple-50 text-2xl">
                        {notification.image}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {notification.type === 'order' && !notification.read && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          markAsRead(notification.id);
                        }}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        View Order
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          deleteNotification(notification.id);
                        }}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}

                  {notification.type === 'follow' && !notification.read && (
                    <div className="mt-3">
                      <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        Follow Back
                      </button>
                    </div>
                  )}
                </div>

                {/* More Options */}
                <div className="shrink-0 opacity-0 transition group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                    className="rounded-lg p-2 hover:bg-gray-200"
                  >
                    <MoreHorizontal className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Load More */}
        {filteredNotifications.length > 0 && (
          <div className="mt-6 text-center">
            <button className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Load Earlier Notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

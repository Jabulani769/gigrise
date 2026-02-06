// src/app/profile/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Home,
  MessageCircle,
  Bell,
  Settings,
  Search,
  MapPin,
  Calendar,
  Link2,
  Star,
  Briefcase,
  Award,
  Users,
  TrendingUp,
  Edit,
  Share2,
  MoreHorizontal,
  CheckCircle,
  Heart,
  ShoppingBag,
} from 'lucide-react';

// Mock user data
const PROFILE_DATA = {
  user: {
    name: 'John Phiri',
    avatar: '👨‍💻',
    title: 'Full Stack Developer | React & Node.js Specialist',
    location: 'Blantyre, Malawi',
    verified: true,
    joinedDate: 'January 2022',
    website: 'johnphiri.dev',
    bio: 'Passionate full-stack developer with 5+ years of experience building scalable web applications. Specializing in React, Node.js, and cloud technologies. Always excited to take on challenging projects and deliver exceptional results.',
    stats: {
      followers: 1234,
      following: 567,
      posts: 89,
      rating: 4.9,
      reviews: 156,
      completedOrders: 234,
    },
  },
  skills: [
    'React.js',
    'Node.js',
    'TypeScript',
    'Next.js',
    'MongoDB',
    'PostgreSQL',
    'AWS',
    'Docker',
    'REST APIs',
    'GraphQL',
  ],
  portfolio: [
    {
      id: '1',
      title: 'E-commerce Platform',
      description: 'Full-stack e-commerce solution with payment integration',
      image: '🛒',
      likes: 234,
    },
    {
      id: '2',
      title: 'Social Media Dashboard',
      description: 'Analytics dashboard for social media management',
      image: '📊',
      likes: 189,
    },
    {
      id: '3',
      title: 'Mobile Banking App',
      description: 'Secure mobile banking application',
      image: '💳',
      likes: 312,
    },
  ],
  experience: [
    {
      id: '1',
      title: 'Senior Full Stack Developer',
      company: 'Tech Solutions MW',
      period: '2021 - Present',
      description: 'Leading development of enterprise web applications',
    },
    {
      id: '2',
      title: 'Full Stack Developer',
      company: 'Digital Agency',
      period: '2019 - 2021',
      description: 'Built client websites and web applications',
    },
  ],
  certifications: [
    { name: 'AWS Certified Solutions Architect', year: '2023' },
    { name: 'React Advanced Certification', year: '2022' },
    { name: 'Node.js Professional', year: '2021' },
  ],
  reviews: [
    {
      id: '1',
      author: 'Sarah Banda',
      avatar: '👩‍🎨',
      rating: 5,
      date: 'Feb 1, 2026',
      comment:
        'Excellent work! John delivered exactly what we needed. Very professional and responsive.',
      project: 'E-commerce Website',
    },
    {
      id: '2',
      author: 'Mike Chirwa',
      avatar: '👨‍💼',
      rating: 5,
      date: 'Jan 28, 2026',
      comment: 'Outstanding developer! Will definitely hire again.',
      project: 'Dashboard Development',
    },
  ],
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('about');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-lg bg-linear-to-br from-blue-600 to-purple-600"></div>
              <span className="hidden text-xl font-bold text-gray-900 sm:block">
                Gigrise
              </span>
            </Link>

            <div className="hidden max-w-md flex-1 px-8 md:block">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pr-4 pl-10 text-gray-700 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

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
              <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                <Bell className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-4 pt-20 pb-8">
        {/* Profile Header Card */}
        <div className="mb-6 overflow-hidden rounded-lg bg-white shadow-sm">
          {/* Cover Photo */}
          <div className="relative h-48 bg-linear-to-r from-blue-600 to-purple-600">
            <button className="absolute right-4 bottom-4 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100">
              <Edit className="mr-1 inline h-4 w-4" />
              Edit Cover
            </button>
          </div>

          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="absolute -top-16 flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-white text-6xl shadow-lg">
              {PROFILE_DATA.user.avatar}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-4">
              <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Share2 className="mr-1 inline h-4 w-4" />
                Share
              </button>
              <Link
                href="/settings/profile"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Edit className="mr-1 inline h-4 w-4" />
                Edit Profile
              </Link>
              <button className="rounded-lg border border-gray-300 p-2 text-gray-700 hover:bg-gray-50">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            {/* User Info */}
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {PROFILE_DATA.user.name}
                </h1>
                {PROFILE_DATA.user.verified && (
                  <CheckCircle className="h-6 w-6 fill-blue-600 text-white" />
                )}
              </div>
              <p className="mt-1 text-gray-700">{PROFILE_DATA.user.title}</p>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{PROFILE_DATA.user.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {PROFILE_DATA.user.joinedDate}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Link2 className="h-4 w-4" />
                  <a href="#" className="text-blue-600 hover:underline">
                    {PROFILE_DATA.user.website}
                  </a>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-4 flex flex-wrap gap-6 border-t pt-4">
                <div>
                  <p className="text-xl font-bold text-gray-900">
                    {PROFILE_DATA.user.stats.followers}
                  </p>
                  <p className="text-sm text-gray-600">Followers</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">
                    {PROFILE_DATA.user.stats.following}
                  </p>
                  <p className="text-sm text-gray-600">Following</p>
                </div>
                <div>
                  <p className="flex items-center text-xl font-bold text-gray-900">
                    <Star className="mr-1 h-5 w-5 fill-yellow-400 text-yellow-400" />
                    {PROFILE_DATA.user.stats.rating}
                  </p>
                  <p className="text-sm text-gray-600">
                    {PROFILE_DATA.user.stats.reviews} reviews
                  </p>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">
                    {PROFILE_DATA.user.stats.completedOrders}
                  </p>
                  <p className="text-sm text-gray-600">Orders Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="mb-6 rounded-lg bg-white shadow-sm">
              <div className="flex border-b">
                {[
                  { id: 'about', label: 'About' },
                  { id: 'portfolio', label: 'Portfolio' },
                  { id: 'reviews', label: 'Reviews' },
                  { id: 'activity', label: 'Activity' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                      activeTab === tab.id
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'about' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-3 font-semibold text-gray-900">
                        About
                      </h3>
                      <p className="text-gray-700">{PROFILE_DATA.user.bio}</p>
                    </div>

                    <div>
                      <h3 className="mb-3 font-semibold text-gray-900">
                        Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {PROFILE_DATA.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3 font-semibold text-gray-900">
                        Experience
                      </h3>
                      <div className="space-y-4">
                        {PROFILE_DATA.experience.map((exp) => (
                          <div key={exp.id} className="flex space-x-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-2xl">
                              💼
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">
                                {exp.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {exp.company}
                              </p>
                              <p className="text-xs text-gray-500">
                                {exp.period}
                              </p>
                              <p className="mt-1 text-sm text-gray-700">
                                {exp.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'portfolio' && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {PROFILE_DATA.portfolio.map((item) => (
                      <div
                        key={item.id}
                        className="overflow-hidden rounded-lg border border-gray-200 transition hover:shadow-md"
                      >
                        <div className="flex h-48 items-center justify-center bg-linear-to-br from-blue-50 to-purple-50 text-6xl">
                          {item.image}
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-900">
                            {item.title}
                          </h4>
                          <p className="mt-1 text-sm text-gray-600">
                            {item.description}
                          </p>
                          <div className="mt-3 flex items-center justify-between">
                            <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600">
                              <Heart className="h-4 w-4" />
                              <span>{item.likes}</span>
                            </button>
                            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {PROFILE_DATA.reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b pb-6 last:border-b-0"
                      >
                        <div className="flex items-start space-x-3">
                          <span className="text-3xl">{review.avatar}</span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-gray-900">
                                {review.author}
                              </h4>
                              <span className="text-sm text-gray-500">
                                {review.date}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="mt-2 text-sm text-gray-700">
                              {review.comment}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              Project: {review.project}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="py-12 text-center">
                    <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-600">
                      Activity feed coming soon
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Certifications */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Certifications</h3>
                <Award className="h-5 w-5 text-blue-600" />
              </div>
              <div className="space-y-3">
                {PROFILE_DATA.certifications.map((cert, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {cert.name}
                      </p>
                      <p className="text-xs text-gray-600">{cert.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-gray-900">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="flex w-full items-center justify-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                  <MessageCircle className="h-5 w-5" />
                  <span>Send Message</span>
                </button>
                <button className="flex w-full items-center justify-center space-x-2 rounded-lg border-2 border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50">
                  <Users className="h-5 w-5" />
                  <span>Follow</span>
                </button>
              </div>
            </div>

            {/* Similar Profiles */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-gray-900">
                Similar Freelancers
              </h3>
              <div className="space-y-3">
                {[
                  {
                    name: 'Alice Tembo',
                    title: 'Mobile Developer',
                    avatar: '👩‍💻',
                  },
                  {
                    name: 'David Kachamba',
                    title: 'UI/UX Designer',
                    avatar: '🎨',
                  },
                ].map((user) => (
                  <div
                    key={user.name}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{user.avatar}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-600">{user.title}</p>
                      </div>
                    </div>
                    <button className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

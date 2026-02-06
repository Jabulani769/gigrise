// src/app/feed/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Send,
  Image as ImageIcon,
  Video,
  Smile,
  TrendingUp,
  Users,
  Briefcase,
  Home,
  Bell,
  Search,
  Menu,
  ShoppingBag,
} from 'lucide-react';

// Mock posts data - mix of gigs and job requests
const MOCK_POSTS = [
  {
    id: '1',
    type: 'gig_offer', // freelancer offering service
    author: {
      name: 'Sarah Banda',
      avatar: '👩‍🎨',
      title: 'Professional Graphic Designer',
      verified: true,
    },
    timeAgo: '2 hours ago',
    content:
      "Hey everyone! 🎨 I'm offering professional logo design services. I'll create a unique, memorable logo that perfectly represents your brand. Check out my recent work below!",
    images: ['🎨', '🖼️', '✨'],
    price: 'Starting at MK 25,000',
    deliveryTime: '3 days',
    category: 'Graphic Design',
    likes: 234,
    comments: 45,
    shares: 12,
    saved: false,
  },
  {
    id: '2',
    type: 'job_request', // client looking for freelancer
    author: {
      name: 'John Phiri',
      avatar: '👨‍💼',
      title: 'Business Owner',
      verified: false,
    },
    timeAgo: '5 hours ago',
    content:
      'Looking for a talented web developer to build an e-commerce website for my business. Need someone experienced with React and payment integration. Budget: MK 150,000-200,000. Please DM with your portfolio!',
    budget: 'MK 150,000 - 200,000',
    deadline: '2 weeks',
    category: 'Web Development',
    likes: 89,
    comments: 23,
    shares: 5,
    saved: true,
  },
  {
    id: '3',
    type: 'gig_offer',
    author: {
      name: 'Grace Mwale',
      avatar: '✍️',
      title: 'Content Writer & SEO Specialist',
      verified: true,
    },
    timeAgo: '1 day ago',
    content:
      "Need quality content for your blog or website? I write SEO-optimized articles that rank and convert. 1000+ words, thoroughly researched, and delivered on time. Let's grow your online presence! 📈",
    images: ['📝'],
    price: 'MK 15,000 per article',
    deliveryTime: '2 days',
    category: 'Content Writing',
    likes: 156,
    comments: 31,
    shares: 8,
    saved: false,
  },
  {
    id: '4',
    type: 'job_request',
    author: {
      name: 'Mike Chirwa',
      avatar: '🏢',
      title: 'Marketing Manager',
      verified: true,
    },
    timeAgo: '1 day ago',
    content:
      'Our company is hiring a social media manager for a 3-month contract. Must have experience with Facebook, Instagram, and TikTok marketing. Create content, manage ads, and engage with our audience. Remote work available!',
    budget: 'MK 200,000/month',
    deadline: 'Ongoing',
    category: 'Digital Marketing',
    likes: 312,
    comments: 67,
    shares: 34,
    saved: false,
  },
];

export default function FeedPage() {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [activeTab, setActiveTab] = useState('all'); // all, gigs, jobs

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleSave = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, saved: !post.saved } : post
      )
    );
  };

  const filteredPosts = posts.filter((post) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'gigs') return post.type === 'gig_offer';
    if (activeTab === 'jobs') return post.type === 'job_request';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100">
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
                <Bell className="h-6 w-6" />
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

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 pt-20 pb-8">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Sidebar */}
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-20 space-y-4">
              {/* User Card */}
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="text-center">
                  <span className="text-5xl">👨‍💻</span>
                  <h3 className="mt-2 font-semibold text-gray-900">
                    John Phiri
                  </h3>
                  <p className="text-sm text-gray-600">Web Developer</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="font-semibold text-gray-900">24</p>
                      <p className="text-gray-600">Gigs</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">4.8</p>
                      <p className="text-gray-600">Rating</p>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    className="mt-3 block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    View Profile
                  </Link>
                </div>
              </div>

              {/* Quick Links */}
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <h4 className="mb-3 font-semibold text-gray-900">
                  Quick Links
                </h4>
                <nav className="space-y-2">
                  <Link
                    href="/feed"
                    className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Home className="h-4 w-4" />
                    <span>Feed</span>
                  </Link>
                  <Link
                    href="/my-gigs"
                    className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Briefcase className="h-4 w-4" />
                    <span>My Gigs</span>
                  </Link>
                  <Link
                    href="/saved"
                    className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Bookmark className="h-4 w-4" />
                    <span>Saved</span>
                  </Link>
                  <Link
                    href="/trending"
                    className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <TrendingUp className="h-4 w-4" />
                    <span>Trending</span>
                  </Link>
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Feed */}
          <main className="lg:col-span-6">
            {/* Create Post Card */}
            <div className="mb-4 rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">👨‍💻</span>
                <input
                  type="text"
                  placeholder="What service are you offering?"
                  className="flex-1 rounded-full bg-gray-100 px-4 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="mt-3 flex items-center justify-between border-t pt-3">
                <div className="flex space-x-2">
                  <button className="flex items-center space-x-2 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100">
                    <ImageIcon className="h-5 w-5 text-green-600" />
                    <span className="hidden text-sm sm:inline">Photo</span>
                  </button>
                  <button className="flex items-center space-x-2 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100">
                    <Video className="h-5 w-5 text-red-600" />
                    <span className="hidden text-sm sm:inline">Video</span>
                  </button>
                </div>
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                  Post Gig
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="mb-4 rounded-lg bg-white p-2 shadow-sm">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
                    activeTab === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All Posts
                </button>
                <button
                  onClick={() => setActiveTab('gigs')}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
                    activeTab === 'gigs'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Gigs Offered
                </button>
                <button
                  onClick={() => setActiveTab('jobs')}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
                    activeTab === 'jobs'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Jobs Wanted
                </button>
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-lg bg-white shadow-sm"
                >
                  {/* Post Header */}
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{post.author.avatar}</span>
                      <div>
                        <div className="flex items-center space-x-1">
                          <h3 className="font-semibold text-gray-900">
                            {post.author.name}
                          </h3>
                          {post.author.verified && (
                            <span className="text-blue-500">✓</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {post.author.title}
                        </p>
                        <p className="text-xs text-gray-500">{post.timeAgo}</p>
                      </div>
                    </div>
                    <button className="rounded-full p-2 hover:bg-gray-100">
                      <MoreHorizontal className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Post Content */}
                  <div className="px-4 pb-3">
                    <p className="whitespace-pre-line text-gray-900">
                      {post.content}
                    </p>

                    {/* Category Badge */}
                    <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                      {post.category}
                    </span>
                  </div>

                  {/* Post Images */}
                  {post.images && (
                    <div
                      className={`grid gap-1 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-3'}`}
                    >
                      {post.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="flex h-64 items-center justify-center bg-linear-to-br from-blue-50 to-purple-50 text-6xl"
                        >
                          {img}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Gig/Job Info */}
                  <div className="border-t bg-gray-50 px-4 py-3">
                    <div className="flex items-center justify-between text-sm">
                      {post.type === 'gig_offer' ? (
                        <>
                          <div>
                            <span className="text-gray-600">Price: </span>
                            <span className="font-semibold text-gray-900">
                              {post.price}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Delivery: </span>
                            <span className="font-semibold text-gray-900">
                              {post.deliveryTime}
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <span className="text-gray-600">Budget: </span>
                            <span className="font-semibold text-gray-900">
                              {post.budget}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Deadline: </span>
                            <span className="font-semibold text-gray-900">
                              {post.deadline}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Engagement Stats */}
                  <div className="flex items-center justify-between border-t px-4 py-2 text-sm text-gray-600">
                    <span>{post.likes} likes</span>
                    <div className="flex space-x-3">
                      <span>{post.comments} comments</span>
                      <span>{post.shares} shares</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-around border-t p-2">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex flex-1 items-center justify-center space-x-2 rounded-lg py-2 hover:bg-gray-100"
                    >
                      <Heart className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Like
                      </span>
                    </button>
                    <button className="flex flex-1 items-center justify-center space-x-2 rounded-lg py-2 hover:bg-gray-100">
                      <MessageCircle className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Comment
                      </span>
                    </button>
                    <button className="flex flex-1 items-center justify-center space-x-2 rounded-lg py-2 hover:bg-gray-100">
                      <Share2 className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Share
                      </span>
                    </button>
                    <button
                      onClick={() => handleSave(post.id)}
                      className="flex flex-1 items-center justify-center space-x-2 rounded-lg py-2 hover:bg-gray-100"
                    >
                      <Bookmark
                        className={`h-5 w-5 ${post.saved ? 'fill-blue-600 text-blue-600' : 'text-gray-600'}`}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Save
                      </span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-20 space-y-4">
              {/* Trending Categories */}
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <h4 className="mb-3 font-semibold text-gray-900">
                  Trending Categories
                </h4>
                <div className="space-y-2">
                  {[
                    { name: 'Web Development', count: '234 gigs', emoji: '💻' },
                    { name: 'Graphic Design', count: '189 gigs', emoji: '🎨' },
                    { name: 'Content Writing', count: '156 gigs', emoji: '✍️' },
                    {
                      name: 'Digital Marketing',
                      count: '142 gigs',
                      emoji: '📱',
                    },
                  ].map((cat) => (
                    <Link
                      key={cat.name}
                      href={`/category/${cat.name.toLowerCase()}`}
                      className="flex items-center justify-between rounded-lg p-2 hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{cat.emoji}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {cat.name}
                          </p>
                          <p className="text-xs text-gray-600">{cat.count}</p>
                        </div>
                      </div>
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Suggested Freelancers */}
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <h4 className="mb-3 font-semibold text-gray-900">
                  Suggested Freelancers
                </h4>
                <div className="space-y-3">
                  {[
                    {
                      name: 'Alice Tembo',
                      title: 'Mobile Developer',
                      avatar: '👩‍💻',
                    },
                    {
                      name: 'David Kachamba',
                      title: 'Video Editor',
                      avatar: '🎬',
                    },
                    {
                      name: 'Emma Banda',
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
          </aside>
        </div>
      </div>
    </div>
  );
}

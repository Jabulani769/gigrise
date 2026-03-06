// src/app/profile/[id]/page.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { ProfileSkeleton } from '@/components/skeletons/Skeleton';
import {
  Home,
  MessageCircle,
  Bell,
  Search,
  MapPin,
  Calendar,
  Link2,
  Star,
  Award,
  Users,
  TrendingUp,
  Share2,
  MoreHorizontal,
  CheckCircle,
  ShoppingBag,
  Loader2,
  UserPlus,
  UserMinus,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  user_type: string | null;
  is_verified: boolean;
  phone_number: string | null;
  city: string | null;
  website: string | null;
  skills: string[] | null;
  hourly_rate: number | null;
  min_project_budget: number | null;
  rating: number;
  reviews_count: number;
  orders_completed: number;
  created_at: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Avatar({ url, name, size = 'md' }: { url: string | null; name: string | null; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'h-10 w-10 text-sm',
    md: 'h-12 w-12 text-base',
    lg: 'h-32 w-32 text-5xl',
  };

  if (url) {
    return <img src={url} alt={name || 'User'} className={`${sizes[size]} rounded-full object-cover`} />;
  }

  const initials = name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '??';
  return (
    <div className={`${sizes[size]} flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 font-bold text-white`}>
      {initials}
    </div>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function UserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  // ✅ Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }
        setCurrentUserId(user.id);

        // If viewing own profile, redirect to /profile
        if (user.id === userId) {
          router.push('/profile');
          return;
        }

        // Get profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Get reviews
        const { data: reviewsData } = await supabase
          .from('reviews')
          .select(`
            *,
            reviewer:profiles!reviews_reviewer_id_fkey (full_name, avatar_url)
          `)
          .eq('reviewee_id', userId)
          .order('created_at', { ascending: false })
          .limit(10);

        if (reviewsData) setReviews(reviewsData);

        // Get followers count
        const { count: followersCount } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', userId);

        setFollowersCount(followersCount || 0);

        // Get following count
        const { count: followingCount } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('follower_id', userId);

        setFollowingCount(followingCount || 0);

        // Get posts count
        const { count: postsCount } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('author_id', userId);

        setPostsCount(postsCount || 0);

        // ✅ Check if current user is following this profile
        const { data: followData } = await supabase
          .from('follows')
          .select('id')
          .eq('follower_id', user.id)
          .eq('following_id', userId)
          .single();

        setIsFollowing(!!followData);

      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) loadProfile();
  }, [router, userId]);

  // ✅ Handle follow/unfollow
  const handleFollowToggle = async () => {
    if (!currentUserId || !profile) return;

    setIsFollowLoading(true);
    try {
      if (isFollowing) {
        // Unfollow
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', currentUserId)
          .eq('following_id', profile.id);

        setIsFollowing(false);
        setFollowersCount(followersCount - 1);
      } else {
        // Follow
        await supabase
          .from('follows')
          .insert({
            follower_id: currentUserId,
            following_id: profile.id,
          });

        setIsFollowing(true);
        setFollowersCount(followersCount + 1);
      }
    } catch (err) {
      console.error('Follow error:', err);
      alert('Failed to update follow status');
    } finally {
      setIsFollowLoading(false);
    }
  };

  // ─── Loading State ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <nav className="fixed top-0 z-50 w-full border-b bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex h-16 items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600"></div>
            </div>
          </div>
        </nav>

        <div className="mx-auto max-w-6xl px-4 pt-20 pb-8">
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600">Profile not found</p>
          <Link href="/feed" className="mt-4 inline-block text-blue-600 hover:underline">
            Go to Feed
          </Link>
        </div>
      </div>
    );
  }

  // ─── Main Render ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100">
      {/* ── Top Navigation ── */}
      <nav className="fixed top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600"></div>
              <span className="hidden text-xl font-bold text-gray-900 sm:block">Gigrise</span>
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

            <div className="flex items-center space-x-2">
              <Link href="/feed" className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                <Home className="h-6 w-6" />
              </Link>
              <Link href="/marketplace" className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                <ShoppingBag className="h-6 w-6" />
              </Link>
              <Link href="/messages" className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                <MessageCircle className="h-6 w-6" />
              </Link>
              <Link href="/notifications" className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                <Bell className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-4 pt-20 pb-8">
        {/* ── Profile Header Card ── */}
        <div className="mb-6 overflow-hidden rounded-lg bg-white shadow-sm">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600"></div>

          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="absolute -top-16 left-6">
              <Avatar url={profile.avatar_url} name={profile.full_name} size="lg" />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-4">
              <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Share2 className="mr-1 inline h-4 w-4" />
                Share
              </button>
              
              {/* ✅ Follow Button */}
              <button
                onClick={handleFollowToggle}
                disabled={isFollowLoading}
                className={`flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${
                  isFollowing
                    ? 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isFollowLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isFollowing ? (
                  <>
                    <UserMinus className="h-4 w-4" />
                    <span>Unfollow</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    <span>Follow</span>
                  </>
                )}
              </button>

              <button className="rounded-lg border border-gray-300 p-2 text-gray-700 hover:bg-gray-50">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            {/* User Info */}
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-gray-900">{profile.full_name || 'No Name Set'}</h1>
                {profile.is_verified && (
                  <CheckCircle className="h-6 w-6 fill-blue-600 text-white" />
                )}
              </div>
              <p className="mt-1 text-gray-700 capitalize">
                {profile.user_type || 'Freelancer'}
                {profile.hourly_rate && ` • MK ${profile.hourly_rate.toLocaleString()}/hr`}
              </p>
              {profile.bio && <p className="mt-2 text-gray-600">{profile.bio}</p>}

              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                {profile.city && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.city}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {formatDate(profile.created_at)}</span>
                </div>
                {profile.website && (
                  <div className="flex items-center space-x-1">
                    <Link2 className="h-4 w-4" />
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {profile.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="mt-4 flex flex-wrap gap-6 border-t pt-4">
                <div>
                  <p className="text-xl font-bold text-gray-900">{followersCount}</p>
                  <p className="text-sm text-gray-600">Followers</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{followingCount}</p>
                  <p className="text-sm text-gray-600">Following</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{postsCount}</p>
                  <p className="text-sm text-gray-600">Posts</p>
                </div>
                <div>
                  <p className="flex items-center text-xl font-bold text-gray-900">
                    <Star className="mr-1 h-5 w-5 fill-yellow-400 text-yellow-400" />
                    {profile.rating > 0 ? profile.rating.toFixed(1) : '—'}
                  </p>
                  <p className="text-sm text-gray-600">{profile.reviews_count} reviews</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{profile.orders_completed}</p>
                  <p className="text-sm text-gray-600">Orders Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* ── Left Column ── */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white shadow-sm">
              <div className="flex border-b">
                {[
                  { id: 'about', label: 'About' },
                  { id: 'reviews', label: `Reviews (${reviews.length})` },
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

              <div className="p-6">
                {activeTab === 'about' && (
                  <div className="space-y-6">
                    {profile.bio && (
                      <div>
                        <h3 className="mb-3 font-semibold text-gray-900">About</h3>
                        <p className="text-gray-700">{profile.bio}</p>
                      </div>
                    )}

                    {profile.skills && profile.skills.length > 0 && (
                      <div>
                        <h3 className="mb-3 font-semibold text-gray-900">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {profile.hourly_rate && (
                      <div>
                        <h3 className="mb-3 font-semibold text-gray-900">Pricing</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Hourly Rate:</span>
                            <span className="font-semibold text-gray-900">
                              MK {profile.hourly_rate.toLocaleString()}
                            </span>
                          </div>
                          {profile.min_project_budget && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Min Project Budget:</span>
                              <span className="font-semibold text-gray-900">
                                MK {profile.min_project_budget.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {reviews.length === 0 ? (
                      <div className="py-12 text-center">
                        <Star className="mx-auto h-12 w-12 text-gray-300" />
                        <p className="mt-2 text-gray-600">No reviews yet</p>
                      </div>
                    ) : (
                      reviews.map((review) => (
                        <div key={review.id} className="border-b pb-6 last:border-b-0">
                          <div className="flex items-start space-x-3">
                            <Avatar url={review.reviewer.avatar_url} name={review.reviewer.full_name} size="md" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-gray-900">
                                  {review.reviewer.full_name || 'Anonymous'}
                                </h4>
                                <span className="text-sm text-gray-500">
                                  {new Date(review.created_at).toLocaleDateString()}
                                </span>
                              </div>

                              <div className="mt-1 flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>

                              {review.comment && <p className="mt-2 text-sm text-gray-700">{review.comment}</p>}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="py-12 text-center">
                    <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-600">Activity feed coming soon</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Right Column ── */}
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-gray-900">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  href={`/messages?user=${profile.id}`}
                  className="flex w-full items-center justify-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Send Message</span>
                </Link>
                <button
                  onClick={handleFollowToggle}
                  disabled={isFollowLoading}
                  className={`flex w-full items-center justify-center space-x-2 rounded-lg px-4 py-2 transition disabled:opacity-50 ${
                    isFollowing
                      ? 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                      : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {isFollowLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : isFollowing ? (
                    <>
                      <UserMinus className="h-5 w-5" />
                      <span>Unfollow</span>
                    </>
                  ) : (
                    <>
                      <Users className="h-5 w-5" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

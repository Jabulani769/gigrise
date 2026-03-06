// src/app/profile/page.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
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
  Edit,
  Share2,
  MoreHorizontal,
  CheckCircle,
  Heart,
  ShoppingBag,
  Loader2,
  Save,
  X,
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
  order: {
    gig: {
      title: string;
    } | null;
    marketplace_item: {
      title: string;
    } | null;
  } | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
    lg: 'h-32 w-32 text-5xl',
  };

  if (url) {
    return (
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
      className={`${sizes[size]} flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 font-bold text-white`}
    >
      {initials}
    </div>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    full_name: '',
    bio: '',
    city: '',
    website: '',
    hourly_rate: '',
    min_project_budget: '',
  });

  // ✅ Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        // Get profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        setProfile(profileData);
        setEditForm({
          full_name: profileData.full_name || '',
          bio: profileData.bio || '',
          city: profileData.city || '',
          website: profileData.website || '',
          hourly_rate: profileData.hourly_rate?.toString() || '',
          min_project_budget: profileData.min_project_budget?.toString() || '',
        });

        // Get reviews
        const { data: reviewsData } = await supabase
          .from('reviews')
          .select(
            `
            *,
            reviewer:profiles!reviews_reviewer_id_fkey (full_name, avatar_url),
            order:orders (
              gig:gigs (title),
              marketplace_item:marketplace_items (title)
            )
          `
          )
          .eq('reviewee_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (reviewsData) setReviews(reviewsData);

        // Get followers count
        const { count: followersCount } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', user.id);

        setFollowersCount(followersCount || 0);

        // Get following count
        const { count: followingCount } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('follower_id', user.id);

        setFollowingCount(followingCount || 0);

        // Get posts count
        const { count: postsCount } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('author_id', user.id);

        setPostsCount(postsCount || 0);
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  // ✅ Upload avatar
  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.id}/avatar.${fileExt}`;

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      // Update local state
      setProfile({ ...profile, avatar_url: data.publicUrl });
    } catch (err: any) {
      console.error('Upload error:', err);
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // ✅ Upload cover photo
  const handleCoverUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !profile) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Image must be less than 10MB');
      return;
    }

    setIsUploadingCover(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${profile.id}/cover.${fileExt}`;

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

      // For now, we'll store cover URL in a way that works with existing schema
      // You could add a cover_url column later, but for demo we'll just show success
      alert(
        'Cover photo uploaded! (Note: Add cover_url column to profiles table to persist)'
      );
    } catch (err: any) {
      console.error('Upload error:', err);
      alert('Failed to upload cover. Please try again.');
    } finally {
      setIsUploadingCover(false);
    }
  };

  // ✅ Save profile edits
  const handleSaveProfile = async () => {
    if (!profile) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.full_name,
          bio: editForm.bio,
          city: editForm.city,
          website: editForm.website,
          hourly_rate: editForm.hourly_rate
            ? parseFloat(editForm.hourly_rate)
            : null,
          min_project_budget: editForm.min_project_budget
            ? parseFloat(editForm.min_project_budget)
            : null,
        })
        .eq('id', profile.id);

      if (error) throw error;

      // Update local state
      setProfile({
        ...profile,
        full_name: editForm.full_name,
        bio: editForm.bio,
        city: editForm.city,
        website: editForm.website,
        hourly_rate: editForm.hourly_rate
          ? parseFloat(editForm.hourly_rate)
          : null,
        min_project_budget: editForm.min_project_budget
          ? parseFloat(editForm.min_project_budget)
          : null,
      });

      setIsEditing(false);
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ Sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // ─── Loading State ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600">Profile not found</p>
          <Link
            href="/feed"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
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
              <Link
                href="/notifications"
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
              >
                <Bell className="h-6 w-6" />
              </Link>
              <button
                onClick={handleSignOut}
                title="Sign out"
                className="flex items-center space-x-2 rounded-lg p-1 hover:bg-gray-100"
              >
                <Avatar
                  url={profile.avatar_url}
                  name={profile.full_name}
                  size="sm"
                />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-4 pt-20 pb-8">
        {/* ── Profile Header Card ── */}
        <div className="mb-6 overflow-hidden rounded-lg bg-white shadow-sm">
          {/* Cover Photo */}
          <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600">
            <input
              type="file"
              id="cover-upload"
              accept="image/*"
              onChange={handleCoverUpload}
              className="hidden"
            />
            <label
              htmlFor="cover-upload"
              className="absolute right-4 bottom-4 flex cursor-pointer items-center space-x-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              {isUploadingCover ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  <span>Edit Cover</span>
                </>
              )}
            </label>
          </div>

          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            {/* Avatar - Clickable */}
            <div className="absolute -top-16">
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <label
                htmlFor="avatar-upload"
                className="group relative block cursor-pointer"
                title="Click to change profile picture"
              >
                <div className="rounded-full border-4 border-white bg-white shadow-lg">
                  <Avatar
                    url={profile.avatar_url}
                    name={profile.full_name}
                    size="lg"
                  />
                </div>
                {/* Upload overlay on hover */}
                <div className="bg-opacity-0 group-hover:bg-opacity-40 absolute inset-0 flex items-center justify-center rounded-full bg-black transition">
                  {isUploadingAvatar ? (
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  ) : (
                    <Edit className="h-8 w-8 text-white opacity-0 transition group-hover:opacity-100" />
                  )}
                </div>
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-4">
              {!isEditing ? (
                <>
                  <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <Share2 className="mr-1 inline h-4 w-4" />
                    Share
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    <Edit className="mr-1 inline h-4 w-4" />
                    Edit Profile
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <X className="mr-1 inline h-4 w-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-1 inline h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-1 inline h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </>
              )}
              <button className="rounded-lg border border-gray-300 p-2 text-gray-700 hover:bg-gray-50">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            {/* User Info */}
            <div className="mt-4">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, full_name: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xl font-bold text-gray-900 focus:border-blue-500 focus:outline-none"
                    placeholder="Your name"
                  />
                  <textarea
                    value={editForm.bio}
                    onChange={(e) =>
                      setEditForm({ ...editForm, bio: e.target.value })
                    }
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
                    placeholder="Tell us about yourself..."
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={editForm.city}
                      onChange={(e) =>
                        setEditForm({ ...editForm, city: e.target.value })
                      }
                      className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
                      placeholder="City"
                    />
                    <input
                      type="url"
                      value={editForm.website}
                      onChange={(e) =>
                        setEditForm({ ...editForm, website: e.target.value })
                      }
                      className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
                      placeholder="Website"
                    />
                    <input
                      type="number"
                      value={editForm.hourly_rate}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          hourly_rate: e.target.value,
                        })
                      }
                      className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
                      placeholder="Hourly rate (MK)"
                    />
                    <input
                      type="number"
                      value={editForm.min_project_budget}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          min_project_budget: e.target.value,
                        })
                      }
                      className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
                      placeholder="Min budget (MK)"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {profile.full_name || 'No Name Set'}
                    </h1>
                    {profile.is_verified && (
                      <CheckCircle className="h-6 w-6 fill-blue-600 text-white" />
                    )}
                  </div>
                  <p className="mt-1 text-gray-700 capitalize">
                    {profile.user_type || 'Freelancer'}
                    {profile.hourly_rate &&
                      ` • MK ${profile.hourly_rate.toLocaleString()}/hr`}
                  </p>
                  {profile.bio && (
                    <p className="mt-2 text-gray-600">{profile.bio}</p>
                  )}

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
                </>
              )}

              {/* Stats */}
              {!isEditing && (
                <div className="mt-4 flex flex-wrap gap-6 border-t pt-4">
                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      {followersCount}
                    </p>
                    <p className="text-sm text-gray-600">Followers</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      {followingCount}
                    </p>
                    <p className="text-sm text-gray-600">Following</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      {postsCount}
                    </p>
                    <p className="text-sm text-gray-600">Posts</p>
                  </div>
                  <div>
                    <p className="flex items-center text-xl font-bold text-gray-900">
                      <Star className="mr-1 h-5 w-5 fill-yellow-400 text-yellow-400" />
                      {profile.rating > 0 ? profile.rating.toFixed(1) : '—'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {profile.reviews_count} reviews
                    </p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">
                      {profile.orders_completed}
                    </p>
                    <p className="text-sm text-gray-600">Orders Completed</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* ── Left Column ── */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="mb-6 rounded-lg bg-white shadow-sm">
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

              {/* Tab Content */}
              <div className="p-6">
                {/* About Tab */}
                {activeTab === 'about' && (
                  <div className="space-y-6">
                    {profile.bio && (
                      <div>
                        <h3 className="mb-3 font-semibold text-gray-900">
                          About
                        </h3>
                        <p className="text-gray-700">{profile.bio}</p>
                      </div>
                    )}

                    {profile.skills && profile.skills.length > 0 && (
                      <div>
                        <h3 className="mb-3 font-semibold text-gray-900">
                          Skills
                        </h3>
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
                        <h3 className="mb-3 font-semibold text-gray-900">
                          Pricing
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Hourly Rate:</span>
                            <span className="font-semibold text-gray-900">
                              MK {profile.hourly_rate.toLocaleString()}
                            </span>
                          </div>
                          {profile.min_project_budget && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Min Project Budget:
                              </span>
                              <span className="font-semibold text-gray-900">
                                MK {profile.min_project_budget.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {!profile.bio &&
                      (!profile.skills || profile.skills.length === 0) && (
                        <div className="py-12 text-center">
                          <p className="text-gray-500">
                            No profile information yet
                          </p>
                          <button
                            onClick={() => setIsEditing(true)}
                            className="mt-4 text-blue-600 hover:underline"
                          >
                            Add your bio and skills
                          </button>
                        </div>
                      )}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {reviews.length === 0 ? (
                      <div className="py-12 text-center">
                        <Star className="mx-auto h-12 w-12 text-gray-300" />
                        <p className="mt-2 text-gray-600">No reviews yet</p>
                        <p className="text-sm text-gray-500">
                          Complete your first order to get reviewed
                        </p>
                      </div>
                    ) : (
                      reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border-b pb-6 last:border-b-0"
                        >
                          <div className="flex items-start space-x-3">
                            <Avatar
                              url={review.reviewer.avatar_url}
                              name={review.reviewer.full_name}
                              size="md"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-gray-900">
                                  {review.reviewer.full_name || 'Anonymous'}
                                </h4>
                                <span className="text-sm text-gray-500">
                                  {new Date(
                                    review.created_at
                                  ).toLocaleDateString()}
                                </span>
                              </div>

                              {/* Stars */}
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

                              {review.comment && (
                                <p className="mt-2 text-sm text-gray-700">
                                  {review.comment}
                                </p>
                              )}

                              {review.order && (
                                <p className="mt-1 text-xs text-gray-500">
                                  Project:{' '}
                                  {review.order.gig?.title ||
                                    review.order.marketplace_item?.title ||
                                    'Unknown'}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Activity Tab */}
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

          {/* ── Right Column ── */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Stats</h3>
                <Award className="h-5 w-5 text-blue-600" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <span className="font-medium text-gray-900">
                    {profile.response_time_hours
                      ? `${profile.response_time_hours}h`
                      : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="font-medium text-gray-900">
                    {profile.orders_completed > 0 ? '100%' : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Earned</span>
                  <span className="font-medium text-gray-900">
                    MK {(profile.total_earned || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-gray-900">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Link
                  href="/messages"
                  className="flex w-full items-center justify-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Messages</span>
                </Link>
                <Link
                  href="/my-gigs"
                  className="flex w-full items-center justify-center space-x-2 rounded-lg border-2 border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50"
                >
                  <Award className="h-5 w-5" />
                  <span>My Gigs</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

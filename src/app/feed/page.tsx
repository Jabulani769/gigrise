// src/app/feed/page.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { FeedSkeleton, SidebarSkeleton } from '@/components/skeletons/Skeleton';
import Comments from '@/components/Comments';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Image as ImageIcon,
  Video,
  TrendingUp,
  Briefcase,
  Home,
  Bell,
  Search,
  ShoppingBag,
  Loader2,
  AlertCircle,
  Send,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  user_type: string | null;
  is_verified: boolean;
  rating: number;
  orders_completed: number;
}

interface Post {
  id: string;
  post_type: 'gig_offer' | 'job_request' | 'general';
  content: string;
  images: string[] | null;
  category: string | null;
  price: string | null;
  budget: string | null;
  delivery_time: string | null;
  deadline: string | null;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  author_id: string;
  author: {
    full_name: string | null;
    avatar_url: string | null;
    is_verified: boolean;
  };
  liked: boolean;
  saved: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

function Avatar({ url, name }: { url: string | null; name: string | null }) {
  if (url) {
    return (
      <img
        src={url}
        alt={name || 'User'}
        className="h-12 w-12 rounded-full object-cover"
      />
    );
  }
  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-sm font-bold text-white">
      {initials}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FeedPage() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'gigs' | 'jobs'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<{ name: string; slug: string }[]>([]);
  
  // ✅ Track which post has comments open
  const [openComments, setOpenComments] = useState<string | null>(null);

  // Create post state
  const [newPost, setNewPost] = useState({
    content: '',
    post_type: 'gig_offer' as 'gig_offer' | 'job_request' | 'general',
    category: '',
    price: '',
    budget: '',
    delivery_time: '',
    deadline: '',
  });
  const [showPostForm, setShowPostForm] = useState(false);
  const [uploadedMedia, setUploadedMedia] = useState<string[]>([]);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  // Load user + posts on mount
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) setCurrentUser(profile);

        const { data: cats } = await supabase
          .from('categories')
          .select('name, slug')
          .eq('is_active', true)
          .limit(6);

        if (cats) setCategories(cats);

        await loadPosts(user.id);
      } catch (err) {
        console.error('Init error:', err);
        setError('Failed to load feed. Please refresh.');
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [router]);

  // Load posts from Supabase
  const loadPosts = async (userId: string) => {
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          author:profiles!posts_author_id_fkey (
            full_name,
            avatar_url,
            is_verified
          )
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (postsError) throw postsError;
      if (!postsData) return;

      const postIds = postsData.map((p) => p.id);

      const { data: likesData } = await supabase
        .from('post_interactions')
        .select('post_id')
        .eq('user_id', userId)
        .eq('interaction_type', 'like')
        .in('post_id', postIds);

      const { data: savesData } = await supabase
        .from('post_interactions')
        .select('post_id')
        .eq('user_id', userId)
        .eq('interaction_type', 'save')
        .in('post_id', postIds);

      const likedIds = new Set(likesData?.map((l) => l.post_id) || []);
      const savedIds = new Set(savesData?.map((s) => s.post_id) || []);

      const enrichedPosts: Post[] = postsData.map((p) => ({
        ...p,
        liked: likedIds.has(p.id),
        saved: savedIds.has(p.id),
      }));

      setPosts(enrichedPosts);
    } catch (err) {
      console.error('Load posts error:', err);
    }
  };

  // Create new post
  const handleCreatePost = async () => {
    if (!newPost.content.trim() || !currentUser) return;

    setIsPosting(true);
    setError('');

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          author_id: currentUser.id,
          post_type: newPost.post_type,
          content: newPost.content.trim(),
          category: newPost.category || null,
          price: newPost.price || null,
          budget: newPost.budget || null,
          delivery_time: newPost.delivery_time || null,
          deadline: newPost.deadline || null,
        })
        .select(`
          *,
          author:profiles!posts_author_id_fkey (
            full_name,
            avatar_url,
            is_verified
          )
        `)
        .single();

      if (error) throw error;

      setPosts([{ ...data, liked: false, saved: false }, ...posts]);

      setNewPost({
        content: '',
        post_type: 'gig_offer',
        category: '',
        price: '',
        budget: '',
        delivery_time: '',
        deadline: '',
      });
      setShowPostForm(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  // Like a post
  const handleLike = async (postId: string) => {
    if (!currentUser) return;

    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const alreadyLiked = post.liked;

    setPosts(posts.map((p) =>
      p.id === postId
        ? { ...p, liked: !alreadyLiked, likes_count: p.likes_count + (alreadyLiked ? -1 : 1) }
        : p
    ));

    try {
      if (alreadyLiked) {
        await supabase
          .from('post_interactions')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', currentUser.id)
          .eq('interaction_type', 'like');

        await supabase
          .from('posts')
          .update({ likes_count: post.likes_count - 1 })
          .eq('id', postId);
      } else {
        await supabase.from('post_interactions').insert({
          post_id: postId,
          user_id: currentUser.id,
          interaction_type: 'like',
        });

        await supabase
          .from('posts')
          .update({ likes_count: post.likes_count + 1 })
          .eq('id', postId);
      }
    } catch (err) {
      setPosts(posts.map((p) =>
        p.id === postId ? { ...p, liked: alreadyLiked, likes_count: post.likes_count } : p
      ));
    }
  };

  // ✅ Toggle comments
  const handleToggleComments = (postId: string) => {
    setOpenComments(openComments === postId ? null : postId);
  };

  // ✅ Share post
  const handleShare = async (postId: string) => {
    const url = `${window.location.origin}/post/${postId}`;
    
    try {
      await navigator.clipboard.writeText(url);
      
      const post = posts.find((p) => p.id === postId);
      if (post) {
        setPosts(posts.map((p) =>
          p.id === postId ? { ...p, shares_count: p.shares_count + 1 } : p
        ));
        
        await supabase
          .from('posts')
          .update({ shares_count: post.shares_count + 1 })
          .eq('id', postId);
      }
      
      alert('✅ Link copied to clipboard!');
    } catch (err) {
      console.error('Share error:', err);
      alert('Failed to copy link');
    }
  };

  // Save a post
  const handleSave = async (postId: string) => {
    if (!currentUser) return;

    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const alreadySaved = post.saved;

    setPosts(posts.map((p) => (p.id === postId ? { ...p, saved: !alreadySaved } : p)));

    try {
      if (alreadySaved) {
        await supabase
          .from('post_interactions')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', currentUser.id)
          .eq('interaction_type', 'save');
      } else {
        await supabase.from('post_interactions').insert({
          post_id: postId,
          user_id: currentUser.id,
          interaction_type: 'save',
        });
      }
    } catch (err) {
      setPosts(posts.map((p) => (p.id === postId ? { ...p, saved: alreadySaved } : p)));
    }
  };

  // Sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const filteredPosts = posts.filter((post) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'gigs') return post.post_type === 'gig_offer';
    if (activeTab === 'jobs') return post.post_type === 'job_request';
    return true;
  });

  // ─── Loading State ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <nav className="fixed top-0 z-50 w-full border-b bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex h-16 items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600"></div>
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200"></div>
              </div>
            </div>
          </div>
        </nav>

        <div className="mx-auto max-w-7xl px-4 pt-20 pb-8">
          <div className="grid gap-6 lg:grid-cols-12">
            <aside className="hidden lg:col-span-3 lg:block">
              <div className="sticky top-20">
                <SidebarSkeleton />
              </div>
            </aside>

            <main className="lg:col-span-6">
              <FeedSkeleton />
            </main>

            <aside className="hidden lg:col-span-3 lg:block">
              <div className="sticky top-20">
                <SidebarSkeleton />
              </div>
            </aside>
          </div>
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

            <div className="hidden max-w-md flex-1 px-4 md:block">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search gigs, jobs, freelancers..."
                  className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pr-4 pl-10 text-gray-700 focus:border-blue-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Link href="/feed" className="rounded-lg p-2 text-blue-600 hover:bg-blue-50">
                <Home className="h-6 w-6" />
              </Link>
              <Link href="/marketplace" className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                <ShoppingBag className="h-6 w-6" />
              </Link>
              <Link href="/messages" className="rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                <MessageCircle className="h-6 w-6" />
              </Link>
              <Link href="/notifications" className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </Link>

              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 rounded-lg p-1 hover:bg-gray-100"
                title="Sign out"
              >
                <Avatar url={currentUser?.avatar_url || null} name={currentUser?.full_name || null} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <div className="mx-auto max-w-7xl px-4 pt-20 pb-8">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* ── Left Sidebar ── */}
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-20 space-y-4">
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="text-center">
                  <div className="flex justify-center">
                    <Avatar url={currentUser?.avatar_url || null} name={currentUser?.full_name || null} />
                  </div>
                  <h3 className="mt-2 font-semibold text-gray-900">
                    {currentUser?.full_name || 'Your Name'}
                  </h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {currentUser?.user_type || 'Freelancer'}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="font-semibold text-gray-900">{currentUser?.orders_completed || 0}</p>
                      <p className="text-gray-600">Orders</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{currentUser?.rating || '—'}</p>
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

              <div className="rounded-lg bg-white p-4 shadow-sm">
                <h4 className="mb-3 font-semibold text-gray-900">Quick Links</h4>
                <nav className="space-y-1">
                  {[
                    { href: '/feed', icon: <Home className="h-4 w-4" />, label: 'Feed' },
                    { href: '/my-gigs', icon: <Briefcase className="h-4 w-4" />, label: 'My Gigs' },
                    { href: '/saved', icon: <Bookmark className="h-4 w-4" />, label: 'Saved' },
                    { href: '/trending', icon: <TrendingUp className="h-4 w-4" />, label: 'Trending' },
                  ].map(({ href, icon, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {icon}
                      <span>{label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* ── Main Feed ── */}
          <main className="lg:col-span-6">
            {error && (
              <div className="mb-4 flex items-start space-x-2 rounded-lg bg-red-50 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Create Post Card */}
            <div className="mb-4 rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <Avatar url={currentUser?.avatar_url || null} name={currentUser?.full_name || null} />
                <button
                  onClick={() => setShowPostForm(!showPostForm)}
                  className="flex-1 rounded-full bg-gray-100 px-4 py-2 text-left text-gray-500 hover:bg-gray-200"
                >
                  What service are you offering?
                </button>
              </div>

              {showPostForm && (
                <div className="mt-4 space-y-3">
                  <div className="flex space-x-2">
                    {[
                      { value: 'gig_offer', label: '🛠️ Offering' },
                      { value: 'job_request', label: '🔍 Looking For' },
                      { value: 'general', label: '💬 General' },
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => setNewPost({ ...newPost, post_type: value as any })}
                        className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                          newPost.post_type === value
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    rows={3}
                    placeholder={
                      newPost.post_type === 'gig_offer'
                        ? "Describe the service you're offering..."
                        : newPost.post_type === 'job_request'
                          ? "Describe what you're looking for..."
                          : 'Share something with the community...'
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 focus:border-blue-500 focus:outline-none"
                  />

                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select Category (optional)</option>
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>

                  {newPost.post_type === 'gig_offer' && (
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Price (e.g. MK 25,000)"
                        value={newPost.price}
                        onChange={(e) => setNewPost({ ...newPost, price: e.target.value })}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Delivery (e.g. 3 days)"
                        value={newPost.delivery_time}
                        onChange={(e) => setNewPost({ ...newPost, delivery_time: e.target.value })}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  )}

                  {newPost.post_type === 'job_request' && (
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Budget (e.g. MK 50,000)"
                        value={newPost.budget}
                        onChange={(e) => setNewPost({ ...newPost, budget: e.target.value })}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Deadline (e.g. 2 weeks)"
                        value={newPost.deadline}
                        onChange={(e) => setNewPost({ ...newPost, deadline: e.target.value })}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setShowPostForm(false)}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreatePost}
                      disabled={isPosting || !newPost.content.trim()}
                      className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isPosting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      <span>{isPosting ? 'Posting...' : 'Post'}</span>
                    </button>
                  </div>
                </div>
              )}

              {!showPostForm && (
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
                  <button
                    onClick={() => setShowPostForm(true)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Post Gig
                  </button>
                </div>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="mb-4 rounded-lg bg-white p-2 shadow-sm">
              <div className="flex space-x-2">
                {[
                  { value: 'all', label: 'All Posts' },
                  { value: 'gigs', label: 'Gigs Offered' },
                  { value: 'jobs', label: 'Jobs Wanted' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setActiveTab(value as any)}
                    className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${
                      activeTab === value
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Posts Feed */}
            {filteredPosts.length === 0 ? (
              <div className="rounded-lg bg-white p-12 text-center shadow-sm">
                <p className="text-4xl">📭</p>
                <h3 className="mt-4 font-semibold text-gray-900">No posts yet</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Be the first to post a gig or job request!
                </p>
                <button
                  onClick={() => setShowPostForm(true)}
                  className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Create First Post
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <article key={post.id} className="rounded-lg bg-white shadow-sm">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center space-x-3">
                        <Avatar url={post.author?.avatar_url || null} name={post.author?.full_name || null} />
                        <div>
                          <div className="flex items-center space-x-1">
                            <h3 className="font-semibold text-gray-900">
                              {post.author?.full_name || 'Unknown User'}
                            </h3>
                            {post.author?.is_verified && <span className="text-blue-500">✓</span>}
                          </div>
                          <p className="text-xs text-gray-500">{timeAgo(post.created_at)}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                          post.post_type === 'gig_offer'
                            ? 'bg-blue-100 text-blue-700'
                            : post.post_type === 'job_request'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {post.post_type === 'gig_offer' ? '🛠️ Offering' : post.post_type === 'job_request' ? '🔍 Looking For' : '💬 General'}
                        </span>
                        <button className="rounded-full p-2 hover:bg-gray-100">
                          <MoreHorizontal className="h-5 w-5 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    <div className="px-4 pb-3">
                      <p className="whitespace-pre-line text-gray-900">{post.content}</p>
                      {post.category && (
                        <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                          {post.category}
                        </span>
                      )}
                    </div>

                    {(post.price || post.budget || post.delivery_time || post.deadline) && (
                      <div className="border-t bg-gray-50 px-4 py-3">
                        <div className="flex items-center justify-between text-sm">
                          {post.post_type === 'gig_offer' ? (
                            <>
                              {post.price && (
                                <div>
                                  <span className="text-gray-600">Price: </span>
                                  <span className="font-semibold text-gray-900">{post.price}</span>
                                </div>
                              )}
                              {post.delivery_time && (
                                <div>
                                  <span className="text-gray-600">Delivery: </span>
                                  <span className="font-semibold text-gray-900">{post.delivery_time}</span>
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              {post.budget && (
                                <div>
                                  <span className="text-gray-600">Budget: </span>
                                  <span className="font-semibold text-gray-900">{post.budget}</span>
                                </div>
                              )}
                              {post.deadline && (
                                <div>
                                  <span className="text-gray-600">Deadline: </span>
                                  <span className="font-semibold text-gray-900">{post.deadline}</span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t px-4 py-2 text-sm text-gray-600">
                      <span>{post.likes_count} likes</span>
                      <div className="flex space-x-3">
                        <span>{post.comments_count} comments</span>
                        <span>{post.shares_count} shares</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-around border-t p-2">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex flex-1 items-center justify-center space-x-2 rounded-lg py-2 hover:bg-gray-100"
                      >
                        <Heart className={`h-5 w-5 ${post.liked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                        <span className="text-sm font-medium text-gray-700">Like</span>
                      </button>

                      <button
                        onClick={() => handleToggleComments(post.id)}
                        className="flex flex-1 items-center justify-center space-x-2 rounded-lg py-2 hover:bg-gray-100"
                      >
                        <MessageCircle className="h-5 w-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Comment</span>
                      </button>

                      <button
                        onClick={() => handleShare(post.id)}
                        className="flex flex-1 items-center justify-center space-x-2 rounded-lg py-2 hover:bg-gray-100"
                      >
                        <Share2 className="h-5 w-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Share</span>
                      </button>

                      <button
                        onClick={() => handleSave(post.id)}
                        className="flex flex-1 items-center justify-center space-x-2 rounded-lg py-2 hover:bg-gray-100"
                      >
                        <Bookmark className={`h-5 w-5 ${post.saved ? 'fill-blue-600 text-blue-600' : 'text-gray-600'}`} />
                        <span className="text-sm font-medium text-gray-700">Save</span>
                      </button>
                    </div>

                    {/* ✅ Comments Section */}
                    {openComments === post.id && (
                      <Comments
                        postId={post.id}
                        currentUserId={currentUser?.id || null}
                        commentsCount={post.comments_count}
                        onCommentAdded={() => loadPosts(currentUser?.id || '')}
                      />
                    )}
                  </article>
                ))}
              </div>
            )}
          </main>

          {/* ── Right Sidebar ── */}
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-20 space-y-4">
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <h4 className="mb-3 font-semibold text-gray-900">Trending Categories</h4>
                <div className="space-y-2">
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        className="flex items-center justify-between rounded-lg p-2 hover:bg-gray-50"
                      >
                        <p className="text-sm font-medium text-gray-900">{cat.name}</p>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No categories yet</p>
                  )}
                </div>
              </div>

              <div className="rounded-lg bg-white p-4 shadow-sm">
                <h4 className="mb-3 font-semibold text-gray-900">Feed Stats</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Posts</span>
                    <span className="font-semibold text-gray-900">{posts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gigs Offered</span>
                    <span className="font-semibold text-gray-900">
                      {posts.filter((p) => p.post_type === 'gig_offer').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jobs Wanted</span>
                    <span className="font-semibold text-gray-900">
                      {posts.filter((p) => p.post_type === 'job_request').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
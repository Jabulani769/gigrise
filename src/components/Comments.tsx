// src/components/Comments.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Send, Trash2, Loader2 } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface CommentsProps {
  postId: string;
  currentUserId: string | null;
  commentsCount: number;
  onCommentAdded: () => void;
}

export default function Comments({
  postId,
  currentUserId,
  commentsCount,
  onCommentAdded,
}: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(
          `
          *,
          user:profiles!comments_user_id_fkey (full_name, avatar_url)
        `
        )
        .eq('post_id', postId)
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (err) {
      console.error('Load comments error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (comments.length === 0) {
      loadComments();
    }
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !currentUserId) return;

    setIsSending(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: currentUserId,
          content: newComment.trim(),
        })
        .select(
          `
          *,
          user:profiles!comments_user_id_fkey (full_name, avatar_url)
        `
        )
        .single();

      if (error) throw error;

      await supabase.rpc('increment_post_comments', { post_id: postId });

      setComments([data, ...comments]);
      setNewComment('');
      onCommentAdded();
    } catch (err) {
      console.error('Add comment error:', err);
      alert('Failed to add comment');
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return;

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      await supabase.rpc('decrement_post_comments', { post_id: postId });

      setComments(comments.filter((c) => c.id !== commentId));
      onCommentAdded();
    } catch (err) {
      console.error('Delete comment error:', err);
      alert('Failed to delete comment');
    }
  };

  const timeAgo = (dateStr: string): string => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(dateStr).getTime()) / 1000
    );
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const Avatar = ({
    url,
    name,
  }: {
    url: string | null;
    name: string | null;
  }) => {
    if (url)
      return (
        <img
          src={url}
          alt={name || 'User'}
          className="h-8 w-8 rounded-full object-cover"
        />
      );
    const initials =
      name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || '??';
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xs font-bold text-white">
        {initials}
      </div>
    );
  };

  return (
    <div className="border-t bg-gray-50 p-4">
      <div className="mb-4 flex items-center space-x-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
          placeholder="Write a comment..."
          className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none"
        />
        <button
          onClick={handleAddComment}
          disabled={!newComment.trim() || isSending}
          className="rounded-full bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </div>

      {isLoading ? (
        <div className="py-4 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : comments.length === 0 ? (
        <p className="py-4 text-center text-sm text-gray-500">
          No comments yet. Be the first!
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start space-x-2">
              <Avatar
                url={comment.user?.avatar_url || null}
                name={comment.user?.full_name || null}
              />
              <div className="flex-1 rounded-lg bg-white p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">
                    {comment.user?.full_name || 'Unknown'}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                      {timeAgo(comment.created_at)}
                    </span>
                    {currentUserId === comment.user_id && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
